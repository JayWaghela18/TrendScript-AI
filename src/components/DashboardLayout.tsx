import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Loader2 } from "lucide-react";

export function DashboardLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="dark min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="dark min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <header className="h-14 flex items-center border-b border-border/50 px-4">
              <SidebarTrigger />
            </header>
            <div className="flex-1 p-6 overflow-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
