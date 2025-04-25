import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar";
import { BookText, Home, Users, DollarSign, Flag, Award, LogOut } from "lucide-react";
import { useNavigate, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // In a real app, this would handle actual logout logic
    toast({
      title: "Déconnecté",
      description: "Vous avez été déconnecté avec succès",
    });
    navigate("/");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex w-full min-h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <BookText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Admin</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/admin")} 
                  tooltip="Dashboard"
                  isActive={location.pathname === "/admin"}>
                  <Home />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/admin/users")} 
                  tooltip="Utilisateurs"
                  isActive={location.pathname === "/admin/users"}>
                  <Users />
                  <span>Utilisateurs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/admin/books")} 
                  tooltip="Livres"
                  isActive={location.pathname === "/admin/books"}>
                  <BookText />
                  <span>Livres</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/admin/transactions")} 
                  tooltip="Transactions"
                  isActive={location.pathname === "/admin/transactions"}>
                  <DollarSign />
                  <span>Transactions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/admin/reports")} 
                  tooltip="Signalements"
                  isActive={location.pathname === "/admin/reports"}>
                  <Flag />
                  <span>Signalements</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/admin/badges")} 
                  tooltip="Badges"
                  isActive={location.pathname === "/admin/badges"}>
                  <Award />
                  <span>Badges</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="p-6 w-full">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
