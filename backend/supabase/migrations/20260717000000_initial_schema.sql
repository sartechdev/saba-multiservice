-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create internal schema for secure helper functions
CREATE SCHEMA IF NOT EXISTS internal;

-- --------------------------------------------------
-- 1. PROFILES TABLE & TRIGGERS
-- --------------------------------------------------

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helper function to check if the current user is an admin (in secure internal schema)
CREATE OR REPLACE FUNCTION internal.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to automatically create a profile for new auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

-- Trigger to prevent self-promotion of roles
CREATE OR REPLACE FUNCTION public.check_profile_role_update()
RETURNS TRIGGER AS $$
BEGIN
  IF new.role IS DISTINCT FROM old.role THEN
    -- If it's a normal user trying to change their own or someone else's role, block it
    IF NOT internal.is_admin() THEN
      RAISE EXCEPTION 'Solo los administradores pueden cambiar los roles.';
    END IF;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_profile_role_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.check_profile_role_update();

REVOKE EXECUTE ON FUNCTION public.check_profile_role_update() FROM anon, authenticated, public;


-- --------------------------------------------------
-- 2. CATEGORIES TABLE
-- --------------------------------------------------

CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('electrodomesticos_nuevos', 'repuestos_accesorios', 'tv_celular_pc')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- --------------------------------------------------
-- 3. PRODUCTS TABLE
-- --------------------------------------------------

CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    price_on_request BOOLEAN NOT NULL DEFAULT false,
    images TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- --------------------------------------------------
-- 4. REPAIR BRANDS TABLE
-- --------------------------------------------------

CREATE TABLE public.repair_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    display_order INT NOT NULL DEFAULT 0
);


-- --------------------------------------------------
-- 5. QUOTES TABLE & TRIGGERS
-- --------------------------------------------------

CREATE TABLE public.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    appliance_type TEXT NOT NULL,
    brand TEXT,
    issue_description TEXT NOT NULL,
    photo_url TEXT,
    status TEXT NOT NULL DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'en_revision', 'respondido', 'cerrado')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to sanitize and secure quote creation
CREATE OR REPLACE FUNCTION public.handle_new_quote()
RETURNS TRIGGER AS $$
BEGIN
  -- Force user_id to be auth.uid() if authenticated, otherwise null
  IF auth.uid() IS NOT NULL THEN
    new.user_id := auth.uid();
  ELSE
    new.user_id := NULL;
  END IF;
  
  -- Force initial status and prevent client-side admin notes injection
  new.status := 'nuevo';
  new.admin_notes := NULL;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_quote_created
  BEFORE INSERT ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_quote();

REVOKE EXECUTE ON FUNCTION public.handle_new_quote() FROM anon, authenticated, public;


-- --------------------------------------------------
-- 6. COMMON TRIGGERS (UPDATED_AT)
-- --------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;


-- --------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS)
-- --------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Allow individuals to read their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR internal.is_admin());

CREATE POLICY "Allow individuals to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Allow public read access to categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Allow admin full write access to categories" ON public.categories
    FOR ALL USING (internal.is_admin()) WITH CHECK (internal.is_admin());

-- Products policies
CREATE POLICY "Allow public read access to products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Allow admin full write access to products" ON public.products
    FOR ALL USING (internal.is_admin()) WITH CHECK (internal.is_admin());

-- Repair Brands policies
CREATE POLICY "Allow public read access to repair_brands" ON public.repair_brands
    FOR SELECT USING (true);

CREATE POLICY "Allow admin full write access to repair_brands" ON public.repair_brands
    FOR ALL USING (internal.is_admin()) WITH CHECK (internal.is_admin());

-- Quotes policies
CREATE POLICY "Allow anyone to insert a quote" ON public.quotes
    FOR INSERT WITH CHECK (length(full_name) >= 2 AND length(phone) >= 6);

CREATE POLICY "Allow individuals to read their own quotes" ON public.quotes
    FOR SELECT USING (auth.uid() = user_id OR internal.is_admin());

CREATE POLICY "Allow admin full write access to quotes" ON public.quotes
    FOR ALL USING (internal.is_admin()) WITH CHECK (internal.is_admin());


-- --------------------------------------------------
-- 8. STORAGE BUCKETS & POLICIES
-- --------------------------------------------------

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('quote-photos', 'quote-photos', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Product Images Policies
-- Note: No SELECT policy is needed for product-images because the bucket is public,
-- which resolves the linter warning about allowing listing of files.
CREATE POLICY "Admin CRUD Product Images" ON storage.objects
  FOR ALL USING (bucket_id = 'product-images' AND internal.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND internal.is_admin());

-- Quote Photos Policies (Private)
CREATE POLICY "Select Quote Photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'quote-photos' AND (
      internal.is_admin() OR 
      (auth.uid()::text = (storage.foldername(name))[2] AND (storage.foldername(name))[1] = 'user-uploads')
    )
  );

CREATE POLICY "Insert Quote Photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'quote-photos' AND (
      internal.is_admin() OR 
      auth.uid() IS NULL OR 
      (auth.uid()::text = (storage.foldername(name))[2] AND (storage.foldername(name))[1] = 'user-uploads')
    )
  );

CREATE POLICY "Delete Quote Photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'quote-photos' AND internal.is_admin()
  );
