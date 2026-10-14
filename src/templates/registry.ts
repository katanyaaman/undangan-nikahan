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

export interface TemplateCardTheme {
  monogram: string;
  displayTitle: string;
  code: string;
  bgGradient: string;
  monogramColor: string;
  accentColor: string;
}

export const templates: TemplateMeta[] = [
  { slug: 'template-1', name: 'Stardew Valley Quest', view: 'templates/template-1/index', rsvpPath: '/template-1/rsvp' },
  { slug: 'template-2', name: 'Classic Romantic', view: 'templates/template-2/index', rsvpPath: '/template-2/rsvp' },
  { slug: 'template-3', name: 'Elegant Nature', view: 'templates/template-3/index', rsvpPath: '/template-3/rsvp' },
  { slug: 'template-4', name: 'Cinematic Noir & Gold', view: 'templates/template-4/index', rsvpPath: '/template-4/rsvp' },
  { slug: 'template-7', name: 'WhatsApp Group (Bestie)', view: 'templates/template-7/index', rsvpPath: '/template-7/rsvp' },
  { slug: 'template-8', name: 'Telegram Group (Bestie)', view: 'templates/template-8/index', rsvpPath: '/template-8/rsvp' },
];

export function getTemplate(slug: string): TemplateMeta | undefined {
  return templates.find((t) => t.slug === slug);
}

/** Tema visual kartu katalog (gradien gelap mewah, monogram inisial, warna teks). */
export const TEMPLATE_THEMES: Record<string, TemplateCardTheme> = {
  'template-1': {
    monogram: 'Sv',
    displayTitle: 'Stardew Valley Quest',
    code: 'TEMPLATE - 1',
    bgGradient: 'background: linear-gradient(135deg, #2b1708 0%, #4d7c2b 55%, #1e3c64 100%);',
    monogramColor: '#ffd84d',
    accentColor: '#48b04d',
  },
  'template-2': {
    monogram: 'Cr',
    displayTitle: 'Classic Romantic',
    code: 'TEMPLATE - 2',
    bgGradient: 'background: linear-gradient(135deg, #2c0b1a 0%, #581432 55%, #350c20 100%);',
    monogramColor: '#fbcfe8',
    accentColor: '#f472b6',
  },
  'template-3': {
    monogram: 'En',
    displayTitle: 'Elegant Nature',
    code: 'TEMPLATE - 3',
    bgGradient: 'background: linear-gradient(135deg, #261706 0%, #542d0c 55%, #331a07 100%);',
    monogramColor: '#fde047',
    accentColor: '#eab308',
  },
  'template-4': {
    monogram: 'Cn',
    displayTitle: 'Cinematic Noir & Gold',
    code: 'TEMPLATE - 4',
    bgGradient: 'background: linear-gradient(135deg, #0d0d0f 0%, #1f1b13 55%, #09090b 100%);',
    monogramColor: '#fef08a',
    accentColor: '#D4AF37',
  },
  'template-7': {
    monogram: 'Wa',
    displayTitle: 'WhatsApp Group',
    code: 'TEMPLATE - 7',
    bgGradient: 'background: linear-gradient(135deg, #062820 0%, #0e4c3a 55%, #073428 100%);',
    monogramColor: '#86efac',
    accentColor: '#22c55e',
  },
  'template-8': {
    monogram: 'Tg',
    displayTitle: 'Telegram Group',
    code: 'TEMPLATE - 8',
    bgGradient: 'background: linear-gradient(135deg, #071c2b 0%, #0d3b5d 55%, #09263a 100%);',
    monogramColor: '#7dd3fc',
    accentColor: '#0ea5e9',
  },
};

/** Thumbnail gradien legacy fallback. */
export const PREVIEWS: Record<string, string> = {
  'template-1': 'from-primary-600 via-primary-500 to-primary-400',
  'template-2': 'from-rose-500 via-pink-500 to-rose-400',
  'template-3': 'from-yellow-900 via-yellow-800 to-stone-700',
  'template-4': 'from-emerald-700 via-emerald-600 to-emerald-500',
  'template-7': 'from-teal-600 via-emerald-600 to-cyan-500',
  'template-8': 'from-sky-500 via-blue-500 to-cyan-400',
};
