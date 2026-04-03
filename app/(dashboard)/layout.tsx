import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let systemRole = 'CUSTOMER';
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('system_role')
      .eq('id', user.id)
      .single();
    if (profile) systemRole = profile.system_role;
  }

  // Read sidebar cookie for default open state
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value !== 'false';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        userRole={systemRole}
        userName={user?.user_metadata?.full_name || ''}
        userEmail={user?.email || ''}
      />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
