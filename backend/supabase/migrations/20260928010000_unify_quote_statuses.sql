-- ==============================================================================
-- Migración: 20260928010000_unify_quote_statuses.sql
-- Descripción: Unifica los estados de la tabla quotes a los dos estados
--              oficiales ('sin_responder' y 'respondido'), actualiza el trigger
--              de inserción y garantiza que appliance_type no sea requerido si existiera.
-- ==============================================================================

-- 1. Si existe la columna appliance_type y tiene NOT NULL, remover la restricción NOT NULL
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'quotes' 
      AND column_name = 'appliance_type'
  ) THEN
    ALTER TABLE public.quotes ALTER COLUMN appliance_type DROP NOT NULL;
  END IF;
END $$;

-- 2. Migrar registros existentes con estados obsoletos a los dos estados actuales
UPDATE public.quotes 
SET status = 'sin_responder' 
WHERE status IN ('nuevo', 'en_revision') OR status IS NULL;

UPDATE public.quotes 
SET status = 'respondido' 
WHERE status = 'cerrado';

-- 3. Eliminar la restricción CHECK anterior de quotes.status
ALTER TABLE public.quotes DROP CONSTRAINT IF EXISTS quotes_status_check;

-- 4. Definir nuevo CHECK constraint permitiendo solo 'sin_responder' y 'respondido'
ALTER TABLE public.quotes 
ADD CONSTRAINT quotes_status_check 
CHECK (status IN ('sin_responder', 'respondido'));

-- 5. Cambiar el valor por defecto de la columna status a 'sin_responder'
ALTER TABLE public.quotes 
ALTER COLUMN status SET DEFAULT 'sin_responder';

-- 6. Actualizar la función trigger para que asigne 'sin_responder' al insertar nuevas consultas
CREATE OR REPLACE FUNCTION public.handle_new_quote()
RETURNS TRIGGER AS $$
BEGIN
  -- Asignar user_id solo si está autenticado
  IF auth.uid() IS NOT NULL THEN
    new.user_id := auth.uid();
  ELSE
    new.user_id := NULL;
  END IF;
  
  -- Forzar estado inicial 'sin_responder' y sanitizar admin_notes privadas
  new.status := 'sin_responder';
  new.admin_notes := NULL;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.handle_new_quote() FROM anon, authenticated, public;
