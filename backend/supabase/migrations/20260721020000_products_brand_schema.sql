-- --------------------------------------------------
-- MIGRACIÓN: AGREGAR MARCA A PRODUCTOS
-- Añade relación entre products y repair_brands para filtrado en catálogo y alta de productos.
-- --------------------------------------------------

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES public.repair_brands(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS brand TEXT NULL;

-- Create index for faster brand filtering
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
