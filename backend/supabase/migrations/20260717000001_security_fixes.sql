-- --------------------------------------------------
-- SECURITY PATCH MIGRATION
-- Fixes Supabase lints for search_path, SECURITY DEFINER exposure,
-- and public bucket listing policies.
-- --------------------------------------------------

-- 1. Create internal schema for secure functions
CREATE SCHEMA IF NOT EXISTS internal;

-- 2. Drop existing policies that depend on public.is_admin() or need update
DROP POLICY IF EXISTS "Allow individuals to read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin full write access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin full write access to products" ON public.products;
DROP POLICY IF EXISTS "Allow admin full write access to repair_brands" ON public.repair_brands;
DROP POLICY IF EXISTS "Allow anyone to insert a quote" ON public.quotes;
DROP POLICY IF EXISTS "Allow individuals to read their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Allow admin full write access to quotes" ON public.quotes;

DROP POLICY IF EXISTS "Admin CRUD Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Select Quote Photos" ON storage.objects;
DROP POLICY IF EXISTS "Insert Quote Photos" ON storage.objects;
DROP POLICY IF EXISTS "Delete Quote Photos" ON storage.objects;

-- Drop deprecated public is_admin() function
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- Create hardened internal.is_admin() function
CREATE OR REPLACE FUNCTION internal.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate policies referencing internal.is_admin()
CREATE POLICY "Allow individuals to read their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR internal.is_admin());

CREATE POLICY "Allow admin full write access to categories" ON public.categories
    FOR ALL USING (internal.is_admin()) WITH CHECK (internal.is_admin());

CREATE POLICY "Allow admin full write access to products" ON public.products
    FOR ALL USING (internal.is_admin()) WITH CHECK (internal.is_admin());

CREATE POLICY "Allow admin full write access to repair_brands" ON public.repair_brands
    FOR ALL USING (internal.is_admin()) WITH CHECK (internal.is_admin());

-- Recreate Quotes policies
CREATE POLICY "Allow anyone to insert a quote" ON public.quotes
    FOR INSERT WITH CHECK (length(full_name) >= 2 AND length(phone) >= 6);

CREATE POLICY "Allow individuals to read their own quotes" ON public.quotes
    FOR SELECT USING (auth.uid() = user_id OR internal.is_admin());

CREATE POLICY "Allow admin full write access to quotes" ON public.quotes
    FOR ALL USING (internal.is_admin()) WITH CHECK (internal.is_admin());

-- Recreate storage policies
CREATE POLICY "Admin CRUD Product Images" ON storage.objects
  FOR ALL USING (bucket_id = 'product-images' AND internal.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND internal.is_admin());

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

-- 3. Fix broad public SELECT policy on product-images bucket
-- We drop the broad SELECT policy since the bucket is public: true, 
-- public links work directly, and listing files is not desired.
DROP POLICY IF EXISTS "Public Read Product Images" ON storage.objects;

-- 4. Harden trigger functions (SET search_path and REVOKE EXECUTE from anon, authenticated, public)
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

ALTER FUNCTION public.check_profile_role_update() SECURITY DEFINER SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.check_profile_role_update() FROM anon, authenticated, public;

ALTER FUNCTION public.handle_new_quote() SECURITY DEFINER SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.handle_new_quote() FROM anon, authenticated, public;

ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
