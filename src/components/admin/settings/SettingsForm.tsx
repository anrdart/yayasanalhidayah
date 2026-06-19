import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Icon } from '../icon';
import { createSupabaseBrowser } from '@/lib/supabase/browser';

interface SettingsMap {
  contact: { whatsapp?: string; email?: string; address?: string; hours?: string };
  social: { instagram?: string; facebook?: string; youtube?: string; tiktok?: string; whatsapp?: string };
  about: { visi?: string; heading?: string; pillars?: string; body?: string };
  donorcta: { heading?: string; description?: string; items?: string; cta_primary_text?: string; cta_primary_url?: string; cta_secondary_text?: string; cta_secondary_url?: string };
  footer: { brand_description?: string; legalitas?: string; copyright?: string };
}

export default function SettingsForm({ initial }: { initial: SettingsMap }) {
  const [contact, setContact] = React.useState(initial.contact ?? {});
  const [social, setSocial] = React.useState(initial.social ?? {});
  const [about, setAbout] = React.useState(initial.about ?? {});
  const [donorcta, setDonorcta] = React.useState(initial.donorcta ?? {});
  const [footer, setFooter] = React.useState(initial.footer ?? {});
  const [saving, setSaving] = React.useState(false);
  const supabase = createSupabaseBrowser();

  function setC<K extends keyof SettingsMap['contact']>(k: K, v: string) {
    setContact((prev) => ({ ...prev, [k]: v }));
  }
  function setS<K extends keyof SettingsMap['social']>(k: K, v: string) {
    setSocial((prev) => ({ ...prev, [k]: v }));
  }

  async function save() {
    setSaving(true);
    // upsert so a key that doesn't exist yet (e.g. 'about'/visi on older DBs)
    // is created rather than silently no-op'd by update().
    const results = await Promise.all([
      supabase.from('settings').upsert({ key: 'contact', value: contact } as never),
      supabase.from('settings').upsert({ key: 'social', value: social } as never),
      supabase.from('settings').upsert({ key: 'about', value: about } as never),
      supabase.from('settings').upsert({ key: 'donorcta', value: donorcta } as never),
      supabase.from('settings').upsert({ key: 'footer', value: footer } as never),
    ]);
    if (results.some((r) => r.error)) toast.error('Gagal menyimpan');
    else toast.success('Pengaturan disimpan');
    setSaving(false);
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Informasi kontak & sosial media situs.</p>
      </div>

      <Tabs defaultValue="contact">
        <TabsList className="flex w-full flex-wrap">
          <TabsTrigger value="contact">Kontak</TabsTrigger>
          <TabsTrigger value="social">Sosial Media</TabsTrigger>
          <TabsTrigger value="about">Tentang Kami</TabsTrigger>
          <TabsTrigger value="donorcta">CTA Donasi</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          <Card>
            <CardHeader><CardTitle className="text-sm">Informasi Kontak</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5"><Label className="text-xs">WhatsApp (tanpa +)</Label><Input value={contact.whatsapp ?? ''} onChange={(e) => setC('whatsapp', e.target.value)} placeholder="6285319480974" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input type="email" value={contact.email ?? ''} onChange={(e) => setC('email', e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Alamat</Label><Input value={contact.address ?? ''} onChange={(e) => setC('address', e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Jam Operasional</Label><Input value={contact.hours ?? ''} onChange={(e) => setC('hours', e.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader><CardTitle className="text-sm">Sosial Media</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(['instagram', 'facebook', 'youtube', 'tiktok'] as const).map((platform) => (
                <div key={platform} className="space-y-1.5">
                  <Label className="text-xs capitalize">{platform}</Label>
                  <Input value={(social as Record<string, string>)[platform] ?? ''} onChange={(e) => setS(platform, e.target.value)} placeholder={`URL ${platform}`} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader><CardTitle className="text-sm">Tentang Kami</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Heading</Label>
                <Input value={about.heading ?? ''} onChange={(e) => setAbout((p) => ({ ...p, heading: e.target.value }))} placeholder="Lembaga sosial & keagamaan dari Bandung Barat." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Pilar (pisahkan koma)</Label>
                <Input value={about.pillars ?? ''} onChange={(e) => setAbout((p) => ({ ...p, pillars: e.target.value }))} placeholder="Amanah, Tepat Sasaran, Sesuai Syariat" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Isi (paragraf dipisah baris kosong)</Label>
                <Textarea rows={6} value={about.body ?? ''} onChange={(e) => setAbout((p) => ({ ...p, body: e.target.value }))} placeholder="Yayasan Alhidayah berpusat di…" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Visi</Label>
                <Textarea rows={3} value={about.visi ?? ''} onChange={(e) => setAbout((p) => ({ ...p, visi: e.target.value }))} placeholder="Menjadi yayasan pendidikan dan dakwah terpercaya di Indonesia…" />
                <p className="text-xs text-muted-foreground">Misi diatur terpisah di menu Konten Situs → Misi.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donorcta">
          <Card>
            <CardHeader><CardTitle className="text-sm">CTA Donasi (Section Donatur Tetap)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Heading</Label>
                <Input value={donorcta.heading ?? ''} onChange={(e) => setDonorcta((p) => ({ ...p, heading: e.target.value }))} placeholder="Jangan pulang dengan kewajiban yang belum selesai." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Deskripsi</Label>
                <Textarea rows={3} value={donorcta.description ?? ''} onChange={(e) => setDonorcta((p) => ({ ...p, description: e.target.value }))} placeholder="Dengan menjadi donatur tetap, Anda ikut menjaga…" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Poin-poin (satu per baris)</Label>
                <Textarea rows={4} value={donorcta.items ?? ''} onChange={(e) => setDonorcta((p) => ({ ...p, items: e.target.value }))} placeholder={"Kafarat dapat terus disalurkan kepada yang berhak.\nWakaf mushaf menjangkau lebih banyak desa pelosok.\nProgram kebaikan berjalan secara berkelanjutan."} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">Tombol Utama — Teks</Label><Input value={donorcta.cta_primary_text ?? ''} onChange={(e) => setDonorcta((p) => ({ ...p, cta_primary_text: e.target.value }))} placeholder="Selesaikan Hari Ini" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Tombol Utama — URL</Label><Input value={donorcta.cta_primary_url ?? ''} onChange={(e) => setDonorcta((p) => ({ ...p, cta_primary_url: e.target.value }))} placeholder="#program" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Tombol Sekunder — Teks</Label><Input value={donorcta.cta_secondary_text ?? ''} onChange={(e) => setDonorcta((p) => ({ ...p, cta_secondary_text: e.target.value }))} placeholder="Hubungi Kami" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Tombol Sekunder — URL</Label><Input value={donorcta.cta_secondary_url ?? ''} onChange={(e) => setDonorcta((p) => ({ ...p, cta_secondary_url: e.target.value }))} placeholder="#kontak" /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card>
            <CardHeader><CardTitle className="text-sm">Footer</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Deskripsi Brand</Label>
                <Textarea rows={3} value={footer.brand_description ?? ''} onChange={(e) => setFooter((p) => ({ ...p, brand_description: e.target.value }))} placeholder="Yayasan Alhidayah adalah lembaga yang berfokus pada…" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Legalitas (satu per baris, format: Label | Nilai)</Label>
                <Textarea rows={3} value={footer.legalitas ?? ''} onChange={(e) => setFooter((p) => ({ ...p, legalitas: e.target.value }))} placeholder={"Kemenkumham RI|0038197 AH.01.12 Tahun 2025\nNPWP|31.714.301.4-421.000"} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Copyright</Label>
                <Input value={footer.copyright ?? ''} onChange={(e) => setFooter((p) => ({ ...p, copyright: e.target.value }))} placeholder="2026 Yayasan Alhidayah · All Rights Reserved" />
              </div>
              <p className="text-xs text-muted-foreground">Alamat, WhatsApp, email diambil dari tab Kontak. Sosial media dari tab Sosial Media.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>
          {saving && <Icon name="loader-circle" className="animate-spin" />}
          Simpan Pengaturan
        </Button>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
