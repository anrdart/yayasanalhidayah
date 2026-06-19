// Resource registry — one definition per marketing content table. ResourceList
// and ResourceForm render generically from these definitions, so adding a new
// content type is a config change, not a new component.

import { z } from 'zod';
import type { Database } from '@/lib/supabase/types';

export type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'image' | 'url';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  listVisible?: boolean;
  bucket?: string;
  placeholder?: string;
}

export interface ResourceDef {
  slug: string;
  table: keyof Database['public']['Tables'];
  label: string;
  labelPlural: string;
  icon: string;
  fields: FieldDef[];
  schema: z.ZodTypeAny;
  orderable?: boolean;
  searchColumns?: string[];
}

const bool = z.boolean().default(true);

export const RESOURCES: Record<string, ResourceDef> = {
  programs: {
    slug: 'programs', table: 'programs', label: 'Program Donasi', labelPlural: 'Program Donasi', icon: 'hand-heart',
    orderable: true, searchColumns: ['title', 'slug'],
    fields: [
      { name: 'title', label: 'Judul', type: 'text', required: true, listVisible: true },
      { name: 'category', label: 'Kategori', type: 'select', required: true, listVisible: true, options: [{ label: 'Kafarat', value: 'Kafarat' }, { label: 'Fidyah', value: 'Fidyah' }, { label: 'Kemanusiaan', value: 'Kemanusiaan' }] },
      { name: 'tag', label: 'Tag', type: 'text', listVisible: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'image', label: 'Gambar', type: 'image', required: true, bucket: 'media', listVisible: true },
      { name: 'alt', label: 'Alt Text', type: 'text' },
      { name: 'description', label: 'Deskripsi', type: 'textarea', required: true },
      { name: 'donasi_url', label: 'URL Donasi', type: 'url', required: true, listVisible: true },
      { name: 'is_published', label: 'Tampilkan', type: 'boolean' },
    ],
    schema: z.object({ title: z.string().min(1), category: z.enum(['Kafarat', 'Fidyah', 'Kemanusiaan']), tag: z.string().optional().default(''), slug: z.string().min(1), image: z.string().min(1), alt: z.string().optional().default(''), description: z.string().min(1), donasi_url: z.string().url(), is_published: bool }),
  },
  trust_logos: {
    slug: 'trust_logos', table: 'trust_logos', label: 'Trust Logo', labelPlural: 'Trust Logo', icon: 'shield-check',
    orderable: true,
    fields: [
      { name: 'name', label: 'Nama', type: 'text', required: true, listVisible: true },
      { name: 'src', label: 'Logo', type: 'image', required: true, bucket: 'media', listVisible: true },
      { name: 'url', label: 'URL', type: 'url' },
      { name: 'is_published', label: 'Tampilkan', type: 'boolean' },
    ],
    schema: z.object({ name: z.string().min(1), src: z.string().min(1), url: z.string().url().optional().or(z.literal('')).default(''), is_published: bool }),
  },
  why_us: {
    slug: 'why_us', table: 'why_us', label: 'Mengapa Kami', labelPlural: 'Mengapa Kami', icon: 'badge-check',
    orderable: true,
    fields: [
      { name: 'n', label: 'Nomor', type: 'text', required: true, listVisible: true },
      { name: 'title', label: 'Judul', type: 'text', required: true, listVisible: true },
      { name: 'descr', label: 'Deskripsi', type: 'textarea', required: true },
      { name: 'is_published', label: 'Tampilkan', type: 'boolean' },
    ],
    schema: z.object({ n: z.string().min(1), title: z.string().min(1), descr: z.string().min(1), is_published: bool }),
  },
  testimonials: {
    slug: 'testimonials', table: 'testimonials', label: 'Testimoni', labelPlural: 'Testimoni', icon: 'quote',
    orderable: true,
    fields: [
      { name: 'name', label: 'Nama', type: 'text', required: true, listVisible: true },
      { name: 'role', label: 'Asal', type: 'text', listVisible: true },
      { name: 'body', label: 'Isi Testimoni', type: 'textarea', required: true },
      { name: 'photo', label: 'Foto', type: 'image', bucket: 'media' },
      { name: 'is_published', label: 'Tampilkan', type: 'boolean' },
    ],
    schema: z.object({ name: z.string().min(1), role: z.string().optional().default(''), body: z.string().min(1), photo: z.string().optional(), is_published: bool }),
  },
  faqs: {
    slug: 'faqs', table: 'faqs', label: 'FAQ', labelPlural: 'FAQ', icon: 'circle-help',
    orderable: true,
    fields: [
      { name: 'q', label: 'Pertanyaan', type: 'text', required: true, listVisible: true },
      { name: 'a', label: 'Jawaban', type: 'textarea', required: true },
      { name: 'is_published', label: 'Tampilkan', type: 'boolean' },
    ],
    schema: z.object({ q: z.string().min(1), a: z.string().min(1), is_published: bool }),
  },
  stats: {
    slug: 'stats', table: 'stats', label: 'Statistik', labelPlural: 'Statistik', icon: 'chart-bar',
    orderable: true,
    fields: [
      { name: 'grp', label: 'Grup', type: 'select', required: true, listVisible: true, options: [{ label: 'Beranda', value: 'home' }, { label: 'Penerima', value: 'penerima' }] },
      { name: 'num', label: 'Angka', type: 'number', required: true, listVisible: true },
      { name: 'suffix', label: 'Suffix', type: 'text' },
      { name: 'label', label: 'Label', type: 'text', required: true, listVisible: true },
      { name: 'is_published', label: 'Tampilkan', type: 'boolean' },
    ],
    schema: z.object({ grp: z.enum(['home', 'penerima']), num: z.coerce.number().int(), suffix: z.string().optional().default(''), label: z.string().min(1), is_published: bool }),
  },
  gallery: {
    slug: 'gallery', table: 'gallery', label: 'Galeri', labelPlural: 'Galeri', icon: 'camera',
    orderable: true,
    fields: [
      { name: 'title', label: 'Judul', type: 'text', required: true, listVisible: true },
      { name: 'bg', label: 'Gambar', type: 'image', required: true, bucket: 'media' },
      { name: 'meta', label: 'Keterangan', type: 'text', listVisible: true },
      { name: 'is_published', label: 'Tampilkan', type: 'boolean' },
    ],
    schema: z.object({ title: z.string().min(1), bg: z.string().min(1), meta: z.string().optional().default(''), is_published: bool }),
  },
  hero: {
    slug: 'hero', table: 'hero_slides', label: 'Hero Slide', labelPlural: 'Hero Slides', icon: 'panels-top-left',
    orderable: true,
    fields: [
      { name: 'src', label: 'Gambar', type: 'image', required: true, bucket: 'media', listVisible: true },
      { name: 'cap', label: 'Caption', type: 'text', listVisible: true },
      { name: 'is_published', label: 'Tampilkan', type: 'boolean' },
    ],
    schema: z.object({ src: z.string().min(1), cap: z.string().optional().default(''), is_published: bool }),
  },
  values: {
    slug: 'values', table: 'values_list', label: 'Nilai', labelPlural: 'Nilai-Nilai', icon: 'gem',
    orderable: true,
    fields: [
      { name: 'n', label: 'Nomor', type: 'text', required: true, listVisible: true },
      { name: 'title', label: 'Judul', type: 'text', required: true, listVisible: true },
      { name: 'descr', label: 'Deskripsi', type: 'textarea', required: true },
      { name: 'is_published', label: 'Tampilkan', type: 'boolean' },
    ],
    schema: z.object({ n: z.string().min(1), title: z.string().min(1), descr: z.string().min(1), is_published: bool }),
  },
  team: {
    slug: 'team', table: 'team', label: 'Anggota Tim', labelPlural: 'Tim', icon: 'users',
    orderable: true,
    fields: [
      { name: 'name', label: 'Nama', type: 'text', listVisible: true },
      { name: 'role', label: 'Jabatan', type: 'text', required: true, listVisible: true },
      { name: 'avatar', label: 'Avatar', type: 'image', bucket: 'avatars' },
      { name: 'is_published', label: 'Tampilkan', type: 'boolean' },
    ],
    schema: z.object({ name: z.string().optional().default(''), role: z.string().min(1), avatar: z.string().optional(), is_published: bool }),
  },
  misi: {
    slug: 'misi', table: 'misi', label: 'Misi', labelPlural: 'Misi', icon: 'target',
    orderable: true,
    fields: [
      { name: 'body', label: 'Isi Misi', type: 'textarea', required: true, listVisible: true },
      { name: 'is_published', label: 'Tampilkan', type: 'boolean' },
    ],
    schema: z.object({ body: z.string().min(1), is_published: bool }),
  },
  rekening: {
    slug: 'rekening', table: 'rekening', label: 'Rekening', labelPlural: 'Rekening', icon: 'landmark',
    orderable: true,
    fields: [
      { name: 'bank', label: 'Bank', type: 'text', required: true, listVisible: true },
      { name: 'no', label: 'Nomor Rekening', type: 'text', required: true, listVisible: true },
      { name: 'label', label: 'Label', type: 'text', required: true, listVisible: true },
      { name: 'account_holder', label: 'Atas Nama', type: 'text' },
      { name: 'is_published', label: 'Tampilkan', type: 'boolean' },
    ],
    schema: z.object({ bank: z.string().min(1), no: z.string().min(1), label: z.string().min(1), account_holder: z.string().optional().default('Yayasan Gerakan Wakaf Sumur'), is_published: bool }),
  },
};
