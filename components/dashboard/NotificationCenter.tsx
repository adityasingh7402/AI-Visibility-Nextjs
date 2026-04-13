'use client';

import { useNotifications, AppNotification } from '@/hooks/useNotifications';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Bell, CheckCircle2, AlertCircle, Info, ShieldAlert, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const router = useRouter();

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.read) markAsRead(notif.id);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'relative rounded-lg h-9 w-9 data-[state=open]:bg-accent'
        )}
      >
        <Bell className="h-4 w-4 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 shadow-lg border-border">
        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
          <DropdownMenuLabel className="font-semibold px-0 text-sm">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        
        <div className="max-h-[70vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-3 opacity-20" />
              <p>You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="py-2">
              {notifications.map((notif) => (
                <DropdownMenuItem
                  key={notif.id}
                  className={cn(
                    "flex flex-col items-start gap-1 p-3 cursor-pointer rounded-none focus:bg-accent/50",
                    !notif.read && "bg-primary/5"
                  )}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="flex items-start gap-3 w-full">
                    {notif.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />}
                    {notif.type === 'error' && <ShieldAlert className="h-4 w-4 text-destructive shrink-0 mt-0.5" />}
                    {notif.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />}
                    {notif.type === 'info' && <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />}
                    
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <p className={cn("text-xs font-semibold leading-none", !notif.read && "text-foreground")}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 font-medium">
                        {new Intl.DateTimeFormat('en-US', {
                          hour: 'numeric', minute: 'numeric',
                          month: 'short', day: 'numeric'
                        }).format(new Date(notif.timestamp))}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
