-- 1. Schema & Constraints: Tornar city e state obrigatórios e adicionar Soft Delete
ALTER TABLE public.profiles 
  ALTER COLUMN city SET NOT NULL,
  ALTER COLUMN state SET NOT NULL;

-- Adicionar coluna deleted_at para Soft Delete em todas as tabelas principais
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- 2. Políticas de Segurança (RLS): Refinar visualização de perfis
-- Remover política antiga
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Nova política: Providers são públicos; Clients só visíveis para Providers com interação ativa
CREATE POLICY "Profiles visibility policy" ON public.profiles
FOR SELECT USING (
  (user_type = 'provider') OR 
  (auth.uid() = id) OR
  (
    user_type = 'client' AND EXISTS (
      SELECT 1 FROM public.service_requests 
      WHERE (client_id = public.profiles.id AND provider_id = auth.uid())
      OR (client_id = auth.uid() AND provider_id = public.profiles.id)
    )
  ) OR
  (
    user_type = 'client' AND EXISTS (
      SELECT 1 FROM public.messages
      WHERE (sender_id = public.profiles.id AND receiver_id = auth.uid())
      OR (sender_id = auth.uid() AND receiver_id = public.profiles.id)
    )
  )
);

-- 3. Indexação: Otimizar busca de profissionais
-- Índice composto para acelerar filtros de categoria e cidade simultaneamente
CREATE INDEX IF NOT EXISTS idx_services_category_city_composite 
ON public.services (category, provider_id);

-- Como a cidade está no perfil, um índice na tabela de perfis também é essencial
CREATE INDEX IF NOT EXISTS idx_profiles_city_state_composite 
ON public.profiles (city, state) 
WHERE user_type = 'provider';

-- 4. Ajuste de Soft Delete nas políticas existentes (Exemplo para pets)
DROP POLICY IF EXISTS "Clients can view own pets" ON public.pets;
CREATE POLICY "Clients can view own pets" ON public.pets 
FOR SELECT USING (auth.uid() = owner_id AND deleted_at IS NULL);
