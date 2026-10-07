/**
 * Katalog template undangan.
 * Tambah template baru = tambah 1 entry + folder views/templates/<slug>/.
 * Route /template-* dan POST rsvp dibuat otomatis dari registry ini.
 */
export interface TemplateMeta {
  slug: string;
  name: string;
  view: string;
  rsvpPath: string;
}

export const templates: TemplateMeta[] = [
  { slug: 'template-1', name: 'Elegant Modern', view: 'templates/template-1/index', rsvpPath: '/template-1/rsvp' },
  { slug: 'template-2', name: 'Classic Romantic', view: 'templates/template-2/index', rsvpPath: '/template-2/rsvp' },
  { slug: 'template-3', name: 'Elegant Nature', view: 'templates/template-3/index', rsvpPath: '/template-3/rsvp' },
  { slug: 'template-4', name: 'Bugis Emerald', view: 'templates/template-4/index', rsvpPath: '/template-4/rsvp' },
  { slug: 'template-5', name: 'WhatsApp Story', view: 'templates/template-5/index', rsvpPath: '/template-5/rsvp' },
  { slug: 'template-6', name: 'Misi Truk MBG (3D)', view: 'templates/template-6/index', rsvpPath: '/template-6/rsvp' },
];

export function getTemplate(slug: string): TemplateMeta | undefined {
  return templates.find((t) => t.slug === slug);
}

/** Thumbnail gradien per template untuk galeri (searah bahasa visual katalog). */
export const PREVIEWS: Record<string, string> = {
  'template-1': 'from-primary-600 via-primary-500 to-primary-400',
  'template-2': 'from-rose-500 via-pink-500 to-rose-400',
  'template-3': 'from-yellow-900 via-yellow-800 to-stone-700',
  'template-4': 'from-emerald-700 via-emerald-600 to-emerald-500',
  'template-5': 'from-emerald-600 via-teal-600 to-green-500',
  'template-6': 'from-amber-600 via-orange-600 to-yellow-500',
};
