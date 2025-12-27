import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Users, UserCheck, UserX, LogOut } from "lucide-react";
import Logo from "@/components/Logo";

const DashboardAdmin = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { users, isLoading, toggleBlock, softDelete } = useAdminUsers();

  useEffect(() => {
    if (!authLoading && (!user || !profile?.is_admin)) {
      navigate("/");
    }
  }, [user, profile, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalUsers = users.length;
  const totalClients = users.filter(u => u.user_type === 'client').length;
  const totalProviders = users.filter(u => u.user_type === 'provider').length;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <header 
        className="py-6 shadow-md"
        style={{ background: 'var(--gradient-header)' }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">Painel Administrativo</span>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <UserCheck className="h-4 w-4 text-client" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Prestadores</CardTitle>
              <UserX className="h-4 w-4 text-provider" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProviders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Controle de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bloqueio</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.filter(u => !u.deleted_at).map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.full_name}</TableCell>
                    <TableCell>
                      <Badge variant={u.user_type === 'provider' ? 'default' : 'secondary'}>
                        {u.user_type === 'provider' ? 'Prestador' : 'Cliente'}
                      </Badge>
                    </TableCell>
                    <TableCell>{u.phone || "-"}</TableCell>
                    <TableCell>
                      {u.is_blocked ? (
                        <Badge variant="destructive">Bloqueado</Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-600">Ativo</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={u.is_blocked} 
                        onCheckedChange={(checked) => toggleBlock({ userId: u.id, isBlocked: checked })}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja excluir este usuário?")) {
                            softDelete(u.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardAdmin;
