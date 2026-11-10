import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import {
    LayoutDashboard,
    Briefcase,
    Bookmark,
    ClipboardList,
    CreditCard,
    Building2,
    Building,
    Users,
    Wallet,
    Settings,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Role = "seeker" | "recruiter" | "admin"

type DashboardMenuItem = {
    name: string
    url: string
    icon: LucideIcon
}

const menuItemsByRole: Record<Role, DashboardMenuItem[]> = {
    seeker: [
        { name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
        { name: "Browse Jobs", url: "/dashboard/seeker/jobs", icon: Briefcase },
        { name: "Saved Jobs", url: "/dashboard/seeker/saved-jobs", icon: Bookmark },
        { name: "My Applications", url: "/dashboard/seeker/applications", icon: ClipboardList },
        { name: "Billing & Subscription", url: "/dashboard/seeker/billing", icon: CreditCard },
        { name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
    ],
    recruiter: [
        { name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
        { name: "My Company", url: "/dashboard/recruiter/company", icon: Building2 },
        { name: "Manage Jobs", url: "/dashboard/recruiter/jobs", icon: Briefcase },
        { name: "Applications", url: "/dashboard/recruiter/applications", icon: ClipboardList },
        { name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
    ],
    admin: [
        { name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Users", url: "/dashboard/admin/users", icon: Users },
        { name: "Companies", url: "/dashboard/admin/companies", icon: Building },
        { name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
        { name: "Payments", url: "/dashboard/admin/payments", icon: Wallet },
        { name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
    ],
}


export function DashboardSidebar() {


    const {data: session, isPending} = useSession();
    const role = session?.user?.role || 'seeker';



    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
                <SidebarGroup>
                    <SidebarMenu>
                        {menuItemsByRole[role as Role].map((item) => (
                            <SidebarMenuItem key={item.name}>
                                <SidebarMenuButton render={<a href={item.url} />}>
                                    <item.icon />
                                    <span>{item.name}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}