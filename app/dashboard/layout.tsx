import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { ThemeToggle } from "@/components/theme-toggle"



const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
           <DashboardSidebar />
            <main className="w-full min-w-0">
                <header className="flex items-center justify-end gap-2">
                    <SidebarTrigger />
                    <ThemeToggle />
                </header>
                {children}
            </main>
        </SidebarProvider>
    );
};

export default DashboardLayout;