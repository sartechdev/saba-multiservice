-- ==============================================================================
-- Migración: 20260721000000_user_registration_schema.sql
-- Descripción: Ampliación de la tabla profiles y actualización del trigger
--              de registro para soportar nombre, apellido, confirmación de
--              términos y fecha de aceptación de términos legales.
-- ==============================================================================

-- 1. Agregar nuevas columnas a public.profiles si no existen
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;

-- 2. Actualizar la función trigger para nuevos usuarios registrados en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_first_name TEXT;
  v_last_name TEXT;
  v_full_name TEXT;
  v_phone TEXT;
  v_terms_accepted BOOLEAN;
  v_terms_accepted_at TIMESTAMPTZ;
BEGIN
  -- Extraer y sanear valores desde raw_user_meta_data
  v_first_name := COALESCE(new.raw_user_meta_data->>'first_name', '');
  v_last_name := COALESCE(new.raw_user_meta_data->>'last_name', '');
  
  -- Si full_name viene provisto explícitamente se toma, sino se combina first_name y last_name
  v_full_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    TRIM(v_first_name || ' ' || v_last_name)
  );
  
  v_phone := COALESCE(new.raw_user_meta_data->>'phone', '');
  
  -- Si no viene en metadatos, por defecto false
  BEGIN
    v_terms_accepted := COALESCE((new.raw_user_meta_data->>'terms_accepted')::boolean, false);
  EXCEPTION WHEN OTHERS THEN
    v_terms_accepted := false;
  END;
  
  -- Si no viene fecha de aceptación, se toma el momento de registro (now())
  BEGIN
    IF new.raw_user_meta_data->>'terms_accepted_at' IS NOT NULL THEN
      v_terms_accepted_at := (new.raw_user_meta_data->>'terms_accepted_at')::timestamptz;
    ELSE
      v_terms_accepted_at := now();
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_terms_accepted_at := now();
  END;

  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    full_name,
    phone,
    role,
    terms_accepted,
    terms_accepted_at
  )
  VALUES (
    new.id,
    v_first_name,
    v_last_name,
    v_full_name,
    v_phone,
    'user',
    v_terms_accepted,
    v_terms_accepted_at
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    terms_accepted = EXCLUDED.terms_accepted,
    terms_accepted_at = EXCLUDED.terms_accepted_at;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Revocar permisos directos de ejecución por seguridad
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
