-- ====================================================================
-- Migración: Añadir respuesta pública del admin a la tabla quotes
-- Fecha: 2026-07-21
-- Descripción: Permite al administrador redactar respuestas visibles para
-- el cliente en la sección "Mi Cuenta", manteniendo "admin_notes" privado.
-- ====================================================================

-- 1. Añadimos la columna admin_response a la tabla public.quotes si no existe
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS admin_response TEXT NULL;

-- 2. Aseguramos y comentamos la separación clara de propósitos
COMMENT ON COLUMN public.quotes.admin_notes IS 'Notas internas del taller 100% privadas. No visibles para los usuarios.';
COMMENT ON COLUMN public.quotes.admin_response IS 'Respuesta oficial del taller para el cliente. Visible en Mi Cuenta si el usuario está registrado.';
