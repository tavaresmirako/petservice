-- Habilitar Realtime para as tabelas necessárias
1	ALTER PUBLICATION supabase_realtime ADD TABLE public.service_requests;
2	ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
3	
4	-- Adicionar coluna request_id na tabela messages para vincular ao chat P2P
5	ALTER TABLE public.messages ADD COLUMN request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE;
6	
7	-- Criar índice para busca rápida de mensagens por solicitação
8	CREATE INDEX idx_messages_request_id ON public.messages(request_id);
9	
10	-- Função para notificar o canal Realtime do provider ao inserir uma nova solicitação
11	CREATE OR REPLACE FUNCTION public.notify_new_service_request()
12	RETURNS TRIGGER AS $$
13	BEGIN
14	  -- O Supabase Realtime já envia o payload da linha inserida.
15	  -- Esta função pode ser expandida para enviar payloads customizados via pg_net se necessário,
16	  -- mas para o fluxo básico, a assinatura da tabela com filtro por provider_id é suficiente.
17	  RETURN NEW;
18	END;
19	$$ LANGUAGE plpgsql;
20	
21	-- Trigger para novas solicitações
22	CREATE TRIGGER trigger_notify_new_service_request
23	AFTER INSERT ON public.service_requests
24	FOR EACH ROW EXECUTE FUNCTION public.notify_new_service_request();
25	
26	-- RLS para permitir que usuários vejam mensagens vinculadas às suas solicitações
27	CREATE POLICY "Users can view messages of their requests" ON public.messages
28	  FOR SELECT USING (
29	    EXISTS (
30	      SELECT 1 FROM public.service_requests
31	      WHERE service_requests.id = messages.request_id
32	      AND (service_requests.client_id = auth.uid() OR service_requests.provider_id = auth.uid())
33	    )
34	  );
35	
36	-- RLS para permitir envio de mensagens em solicitações ativas
37	CREATE POLICY "Users can send messages to their requests" ON public.messages
38	  FOR INSERT WITH CHECK (
39	    EXISTS (
40	      SELECT 1 FROM public.service_requests
41	      WHERE service_requests.id = request_id
42	      AND (service_requests.client_id = auth.uid() OR service_requests.provider_id = auth.uid())
43	      AND service_requests.status = 'accepted'
44	    )
45	  );
46	
