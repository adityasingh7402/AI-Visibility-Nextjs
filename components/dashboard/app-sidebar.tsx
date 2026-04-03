'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  FileText,
  Bolt,
  CreditCard,
  Settings,
  Users,
  TrendingUp,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

// ── Navigation items ──

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  roles: string[];
}

const NAV_MAIN: NavItem[] = [
  { label: 'Dashboard',          icon: LayoutDashboard, href: '/dashboard',           roles: ['CUSTOMER', 'SUPERADMIN'] },
  { label: 'Run Analysis',       icon: Bolt,            href: '/dashboard/analysis',   roles: ['CUSTOMER'] },
  { label: 'Reports',            icon: FileText,        href: '/dashboard/reports',     roles: ['CUSTOMER', 'SUPERADMIN'] },
  { label: 'Keyword Discovery',  icon: Search,          href: '/dashboard/keywords',    roles: ['CUSTOMER', 'SUPERADMIN'] },
  { label: 'Content Validator',  icon: FileText,        href: '/dashboard/content',     roles: ['CUSTOMER', 'SUPERADMIN'] },
  { label: 'Visibility Trends',  icon: TrendingUp,      href: '/dashboard/progress',    roles: ['CUSTOMER', 'SUPERADMIN'] },
];

const NAV_ADMIN: NavItem[] = [
  { label: 'Clients', icon: Users, href: '/dashboard/clients', roles: ['SUPERADMIN'] },
];

const NAV_SETTINGS: NavItem[] = [
  { label: 'Billing',  icon: CreditCard, href: '/dashboard/billing',  roles: ['CUSTOMER'] },
  { label: 'Settings', icon: Settings,   href: '/dashboard/settings', roles: ['CUSTOMER', 'SUPERADMIN'] },
];

// ── Component ──

interface AppSidebarProps {
  userRole: string;
  userName: string;
  userEmail: string;
}

export function AppSidebar({ userRole, userName, userEmail }: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const filterByRole = (items: NavItem[]) =>
    items.filter((item) => item.roles.includes(userRole));

  const mainItems = filterByRole(NAV_MAIN);
  const adminItems = filterByRole(NAV_ADMIN);
  const settingsItems = filterByRole(NAV_SETTINGS);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Logo / Brand */}
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 group px-2">
          <div className="h-8 w-8 shrink-0 bg-primary rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm">
            G
          </div>
          <span className="text-lg font-black text-foreground tracking-tighter uppercase truncate group-data-[collapsible=icon]:hidden">
            GEO Visibility
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Main nav */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin section */}
        {adminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg group-data-[collapsible=icon]:justify-center">
          <div className="h-9 w-9 shrink-0 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground text-sm">
            {userName ? userName.substring(0, 2).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold text-foreground truncate">{userName || 'User'}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider truncate">
              {userEmail || 'user@example.com'}
            </p>
          </div>
        </div>
        <form
          action="/auth/sign-out"
          method="POST"
        >
          <Button
            type="submit"
            variant="ghost"
            className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-semibold h-9 rounded-lg justify-start px-3 gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          >
            <LogOut size={16} />
            <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
