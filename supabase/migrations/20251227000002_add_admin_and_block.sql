-- 1. Adicionar coluna is_blocked e is_admin à tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Atualizar o tipo user_type para incluir 'admin' (se necessário, mas usaremos is_admin para maior flexibilidade)
-- Nota: O enum user_type já existe, mas is_admin é uma flag booleana mais segura.

-- 3. Políticas de RLS para Administradores
-- Permitir que administradores façam TUDO em profiles
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
);

-- Permitir que administradores vejam todos os pets
CREATE POLICY "Admins can view all pets" ON public.pets
FOR SELECT USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
);

-- Permitir que administradores vejam todas as solicitações
CREATE POLICY "Admins can view all service_requests" ON public.service_requests
FOR SELECT USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
);

-- 4. Criar o usuário administrador inicial (opcional, mas recomendado para o prompt)
-- Nota: Em um ambiente real, isso seria feito via Auth API, mas aqui marcamos o perfil se ele existir.
-- O email Thiago@petservice deve ser cadastrado via interface e depois promovido a admin.
