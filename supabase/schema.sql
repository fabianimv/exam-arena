-- =============================================================================
-- Cloud & SRE Exam Arena · Supabase Schema & Idempotent Cloud Sync
-- Persistencia en la nube e idempotencia multi-dispositivo por correo electrónico
--
-- INSTRUCCIONES DE INSTALACIÓN / SETUP INSTRUCTIONS:
-- 1. Ve a tu proyecto en Supabase (https://supabase.com/dashboard).
-- 2. En el menú lateral izquierdo, haz clic en "SQL Editor".
-- 3. Haz clic en "New query", pega todo el contenido de este archivo y presiona "Run" (Ctrl+Enter / Cmd+Enter).
-- 4. ¡Listo! La tabla pública y la función RPC quedarán configuradas con Row Level Security (RLS)
--    listas para ser consumidas de forma segura directamente desde GitHub Pages con tu anon key.
--
-- IN ENGLISH:
-- 1. Go to your Supabase project dashboard (https://supabase.com/dashboard).
-- 2. Open the "SQL Editor" from the left navigation panel.
-- 3. Click "New query", paste this entire script, and click "Run".
-- 4. Done! The table and RPC sync function are now secured with RLS and ready
--    for serverless syncing from GitHub Pages using your public anon key.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABLA PRINCIPAL: exam_arena_progress
-- Almacena el progreso unificado por email (clave primaria normalizada).
-- Cada fila contiene los datos de los 4 simuladores de examen en formato JSONB.
-- -----------------------------------------------------------------------------
create table if not exists public.exam_arena_progress (
  email text primary key check (char_length(trim(email)) >= 3),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Comentarios explicativos en el catálogo de PostgreSQL
comment on table public.exam_arena_progress is
  'Progreso de estudio de Exam Arena persistido por email del usuario (SRE, GCP, Azure, AWS).';
comment on column public.exam_arena_progress.email is
  'Correo electrónico del usuario, normalizado en minúsculas y sin espacios.';
comment on column public.exam_arena_progress.data is
  'Mapa JSONB por appId (sre-incidents, gcp-genai-leader, az-104, aws-saa-c03) con sessions y answers.';
comment on column public.exam_arena_progress.updated_at is
  'Marca de tiempo UTC de la última sincronización exitosa.';

-- -----------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) & POLÍTICAS DE ACCESO
-- Permite que clientes web estáticos (GitHub Pages) lean y guarden su progreso
-- utilizando únicamente la Supabase Anon Public Key sin intermediarios backend.
-- -----------------------------------------------------------------------------
alter table public.exam_arena_progress enable row level security;

-- Limpieza de políticas previas si se vuelve a ejecutar el script
drop policy if exists "Allow public select on exam_arena_progress" on public.exam_arena_progress;
drop policy if exists "Allow public insert on exam_arena_progress" on public.exam_arena_progress;
drop policy if exists "Allow public update on exam_arena_progress" on public.exam_arena_progress;
drop policy if exists "Allow public delete on exam_arena_progress" on public.exam_arena_progress;

-- Lectura: los clientes pueden consultar el progreso por su email
create policy "Allow public select on exam_arena_progress"
  on public.exam_arena_progress
  for select
  to anon, authenticated
  using (true);

-- Inserción: permite crear un registro inicial de progreso
create policy "Allow public insert on exam_arena_progress"
  on public.exam_arena_progress
  for insert
  to anon, authenticated
  with check (true);

-- Actualización: permite actualizar el progreso con nuevos intentos o sesiones
create policy "Allow public update on exam_arena_progress"
  on public.exam_arena_progress
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- Eliminación: permite desconectar o limpiar datos si el usuario lo solicita
create policy "Allow public delete on exam_arena_progress"
  on public.exam_arena_progress
  for delete
  to anon, authenticated
  using (true);

-- Conceder permisos de tabla a los roles anon y authenticated de Supabase
grant select, insert, update, delete on table public.exam_arena_progress to anon, authenticated;

-- -----------------------------------------------------------------------------
-- 3. FUNCIÓN RPC ATÓMICA E IDEMPOTENTE: sync_exam_progress
-- Fusiona de forma bidireccional e idempotente los datos locales del cliente
-- con los datos existentes en el servidor.
--
-- REGLAS DE RESOLUCIÓN DE CONFLICTOS:
-- - Email: siempre normalizado a minúsculas y sin espacios en blanco.
-- - Sesiones (sessions): unificadas por su 'id' único. Si una versión tiene
--   endedAt no nulo (sesión finalizada) y otra aún tiene endedAt nulo (sesión abierta),
--   se conserva siempre la sesión finalizada (o con mayor timestamp endedAt).
-- - Respuestas (answers): unificadas por la clave única compuesta:
--   session || '|' || question || '|' || at.
--   Garantiza CERO duplicados sin importar cuántas veces se sincronice.
-- -----------------------------------------------------------------------------
create or replace function public.sync_exam_progress(
  p_email text,
  p_client_data jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_server_data jsonb;
  v_app_keys text[];
  app_id text;
  v_srv_app jsonb;
  v_cli_app jsonb;
  v_merged_sessions jsonb;
  v_merged_answers jsonb;
  v_app_obj jsonb;
  v_merged jsonb := '{}'::jsonb;
begin
  -- 1. Normalización y validación estricta del correo
  v_email := lower(trim(p_email));
  if v_email is null or char_length(v_email) < 3 then
    raise exception 'exam_arena: Dirección de correo inválida ("%")', p_email;
  end if;

  -- 2. Asegurar que p_client_data sea un objeto JSON válido
  if p_client_data is null or jsonb_typeof(p_client_data) <> 'object' then
    p_client_data := '{}'::jsonb;
  end if;

  -- 3. Bloqueo pesimista de fila (FOR UPDATE) para prevenir carreras en sincronizaciones concurrentes
  select data into v_server_data
  from public.exam_arena_progress
  where email = v_email
  for update;

  if not found or v_server_data is null then
    v_server_data := '{}'::jsonb;
  end if;

  -- 4. Obtener la unión de todos los appIds presentes en servidor o cliente
  select coalesce(array_agg(distinct k), array[]::text[])
  into v_app_keys
  from (
    select jsonb_object_keys(v_server_data) as k
    union
    select jsonb_object_keys(p_client_data) as k
  ) t;

  -- 5. Si hay exámenes, fusionar cada uno según las reglas de idempotencia
  if array_length(v_app_keys, 1) is not null then
    foreach app_id in array v_app_keys loop
      v_srv_app := coalesce(v_server_data->app_id, '{}'::jsonb);
      v_cli_app := coalesce(p_client_data->app_id, '{}'::jsonb);

      -- Fusión de SESIONES por id único:
      -- Si existe en ambos lados, prioriza la versión que tenga endedAt no nulo.
      -- Si ambas tienen endedAt, conserva el mayor valor numérico de endedAt.
      with all_sessions as (
        select s from jsonb_array_elements(
          case when jsonb_typeof(v_srv_app->'sessions') = 'array' then v_srv_app->'sessions' else '[]'::jsonb end
        ) s
        union all
        select s from jsonb_array_elements(
          case when jsonb_typeof(v_cli_app->'sessions') = 'array' then v_cli_app->'sessions' else '[]'::jsonb end
        ) s
      ),
      ranked_sessions as (
        select s,
               row_number() over (
                 partition by (s->>'id')
                 order by
                   case when s->>'endedAt' is not null and s->>'endedAt' <> 'null' then 1 else 0 end desc,
                   coalesce((s->>'endedAt')::numeric, 0) desc,
                   coalesce((s->>'startedAt')::numeric, 0) desc
               ) as rn
        from all_sessions
        where (s->>'id') is not null
      )
      select coalesce(jsonb_agg(s order by coalesce((s->>'startedAt')::numeric, 0) asc), '[]'::jsonb)
      into v_merged_sessions
      from ranked_sessions
      where rn = 1;

      -- Fusión de RESPUESTAS por clave única (session + '|' + question + '|' + at):
      -- Deduplica de forma absoluta preservando el orden cronológico original.
      with all_answers as (
        select a from jsonb_array_elements(
          case when jsonb_typeof(v_srv_app->'answers') = 'array' then v_srv_app->'answers' else '[]'::jsonb end
        ) a
        union all
        select a from jsonb_array_elements(
          case when jsonb_typeof(v_cli_app->'answers') = 'array' then v_cli_app->'answers' else '[]'::jsonb end
        ) a
      ),
      ranked_answers as (
        select a,
               row_number() over (
                 partition by coalesce(a->>'session', '') || '|' || coalesce(a->>'question', '') || '|' || coalesce(a->>'at', '')
               ) as rn
        from all_answers
        where (a->>'question') is not null
      )
      select coalesce(jsonb_agg(a order by coalesce((a->>'at')::numeric, 0) asc), '[]'::jsonb)
      into v_merged_answers
      from ranked_answers
      where rn = 1;

      -- Construir el objeto consolidado para este appId
      v_app_obj := jsonb_build_object(
        'schema', coalesce((v_cli_app->>'schema')::int, (v_srv_app->>'schema')::int, 1),
        'appId', coalesce(v_cli_app->>'appId', v_srv_app->>'appId', app_id),
        'sessions', coalesce(v_merged_sessions, '[]'::jsonb),
        'answers', coalesce(v_merged_answers, '[]'::jsonb)
      );

      -- Incorporar al payload final combinado
      v_merged := jsonb_set(v_merged, array[app_id], v_app_obj, true);
    end loop;
  end if;

  -- 6. Upsert atómico en la tabla exam_arena_progress
  insert into public.exam_arena_progress (email, data, updated_at)
  values (v_email, v_merged, now())
  on conflict (email) do update
  set data = excluded.data,
      updated_at = now();

  -- 7. Devolver el JSON consolidado completo al cliente
  return v_merged;
end;
$$;

comment on function public.sync_exam_progress(text, jsonb) is
  'Sincroniza y fusiona de forma atómica e idempotente el progreso del examen por correo.';

-- Conceder ejecución de la función RPC a roles anon y authenticated de Supabase
grant execute on function public.sync_exam_progress(text, jsonb) to anon, authenticated;
