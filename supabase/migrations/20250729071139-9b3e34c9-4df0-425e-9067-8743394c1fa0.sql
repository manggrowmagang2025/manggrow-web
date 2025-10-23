-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = $1
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_subscription(user_id UUID)
RETURNS TABLE(
  id UUID,
  status subscription_status,
  license_type license_type,
  current_period_end TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT us.id, us.status, us.license_type, us.current_period_end
  FROM public.user_subscriptions us
  WHERE us.user_id = $1 AND us.status = 'active'
  ORDER BY us.created_at DESC
  LIMIT 1;
$$;