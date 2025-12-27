import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService, AdminUser } from "@/services/supabase/adminService";
import { useToast } from "@/hooks/use-toast";

export const useAdminUsers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminService.getAllUsers,
  });

  const toggleBlockMutation = useMutation({
    mutationFn: ({ userId, isBlocked }: { userId: string; isBlocked: boolean }) =>
      adminService.toggleUserBlock(userId, isBlocked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "Sucesso",
        description: "Status de bloqueio do usuário atualizado.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o status do usuário.",
        variant: "destructive",
      });
    },
  });

  const softDeleteMutation = useMutation({
    mutationFn: (userId: string) => adminService.softDeleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "Sucesso",
        description: "Usuário excluído (Soft Delete) com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    toggleBlock: toggleBlockMutation.mutate,
    softDelete: softDeleteMutation.mutate,
  };
};
