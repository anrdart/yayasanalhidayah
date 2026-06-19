import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Icon } from './icon';
import KeepAliveWidget from './KeepAliveWidget';
import ActivityFeed from './ActivityFeed';
import type { ActivityEntry } from '@/lib/supabase/types';

interface Props {
  recent: ActivityEntry[];
  lastHeartbeat: string | null;
  counts: Record<string, number>;
}

const rupiahCompact = (n: number): string => {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1).replace('.', ',')} M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace('.', ',')} jt`;
  if (n >= 1_000) return `Rp ${Math.round(n / 1000)} rb`;
  return `Rp ${n}`;
};
const formatCount = (n: number): string => n.toLocaleString('id-ID');

const STAT_CARDS: { key: string; label: string; icon: string; href: string; format?: (n: number) => string }[] = [
  { key: 'programs', label: 'Total Campaign', icon: 'hand-heart', href: '/admin/content/programs' },
  { key: 'raised', label: 'Total Donasi', icon: 'wallet', href: '/admin/content/programs', format: rupiahCompact },
  { key: 'donatur', label: 'Total Donatur', icon: 'users', href: '/admin/content/programs' },
  { key: 'articles', label: 'Artikel', icon: 'newspaper', href: '/admin/articles' },
];

export default function DashboardHome({ recent, lastHeartbeat, counts }: Props) {
  const [showUpdate, setShowUpdate] = React.useState(false);
  const baselineRef = React.useRef<string | null>(recent[0]?.created_at ?? null);

  React.useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const res = await fetch('/api/dashboard-version');
        if (!res.ok) return;
        const { ts } = (await res.json()) as { ts: string | null };
        if (!active || !ts) return;
        if (baselineRef.current && ts !== baselineRef.current) {
          setShowUpdate(true);
        }
        if (!baselineRef.current) baselineRef.current = ts;
      } catch { /* network error, skip */ }
    };
    // First check after 10s, then every 30s.
    const initial = setTimeout(check, 10_000);
    const handle = setInterval(check, 30_000);
    return () => { active = false; clearTimeout(initial); clearInterval(handle); };
  }, []);

  function handleRefresh() {
    setShowUpdate(false);
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <AlertDialog open={showUpdate} onOpenChange={setShowUpdate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ada Update pada Dashboard</AlertDialogTitle>
            <AlertDialogDescription>
              Data dashboard sudah berubah. Muat ulang untuk melihat perubahan terbaru?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Nanti</AlertDialogCancel>
            <AlertDialogAction onClick={handleRefresh}>Ya, refresh</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Ringkasan konten dan status sistem.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((c) => (
          <a key={c.key} href={c.href} className="block">
            <Card className="transition-colors hover:border-primary/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                <Icon name={c.icon} className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tabular-nums">
                  {c.format ? c.format(counts[c.key] ?? 0) : formatCount(counts[c.key] ?? 0)}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <KeepAliveWidget lastHeartbeat={lastHeartbeat} />
        </div>
        <div className="lg:col-span-2">
          <ActivityFeed initial={recent} />
        </div>
      </div>
    </div>
  );
}
