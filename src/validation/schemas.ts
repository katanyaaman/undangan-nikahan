/** Pesan error disamakan dengan pesan validasi Laravel. */
import { z } from 'zod';

export type FieldErrors = Record<string, string[]>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    out[key] = [...(out[key] ?? []), issue.message];
  }
  return out;
}

export function firstMessages(errors: FieldErrors): string[] {
  return Object.values(errors).map((msgs) => msgs[0]);
}

const emptyToUndefined = (v: unknown) => (v === '' || v === undefined ? undefined : v);

export const rsvpSchema = z.object({
  name: z.string({ required_error: 'The name field is required.' }).trim().min(1, 'The name field is required.').max(255, 'The name field must not be greater than 255 characters.'),
  email: z
    .string({ required_error: 'The email field is required.' })
    .trim()
    .min(1, 'The email field is required.')
    .email('The email field must be a valid email address.')
    .max(255),
  phone: z.preprocess(emptyToUndefined, z.string().max(20, 'The phone field must not be greater than 20 characters.').optional()),
  number_of_guests: z.coerce
    .number({ invalid_type_error: 'The number of guests field must be an integer.' })
    .int('The number of guests field must be an integer.')
    .min(1, 'The number of guests field must be at least 1.')
    .max(5, 'The number of guests field must not be greater than 5.'),
  message: z.preprocess(emptyToUndefined, z.string().max(1000, 'The message field must not be greater than 1000 characters.').optional()),
  attendance: z.enum(['hadir', 'tidak_hadir'], { errorMap: () => ({ message: 'The selected attendance is invalid.' }) }),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'The email field is required.').email('The email field must be a valid email address.'),
  password: z.string().min(1, 'The password field is required.'),
});

export const orderAccountSchema = z.object({
  name: z.string().trim().min(1, 'The name field is required.').max(255),
  email: z.string().trim().min(1, 'The email field is required.').email('The email field must be a valid email address.').max(255),
  password: z.string().min(8, 'The password field must be at least 8 characters.').max(255),
});

export const orderEventSchema = z.object({
  template_slug: z.string().min(1, 'Pilih template.'),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Slug minimal 3 karakter.')
    .max(60, 'Slug maksimal 60 karakter.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya boleh huruf kecil, angka, dan strip.'),
});

export const orderSchema = orderAccountSchema.merge(orderEventSchema);

export type OrderInput = z.infer<typeof orderSchema>;

const optionalText = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().max(max).optional());

export const eventSettingsSchema = z.object({
  event_type: z.enum(['wedding', 'seminar', 'aqiqah', 'birthday', 'other'], {
    errorMap: () => ({ message: 'The selected event type is invalid.' }),
  }),
  bride_name: optionalText(255),
  bride_father: optionalText(255),
  bride_mother: optionalText(255),
  groom_name: optionalText(255),
  groom_father: optionalText(255),
  groom_mother: optionalText(255),
  event_title: optionalText(255),
  event_description: z.preprocess(emptyToUndefined, z.string().optional()),
  event_date: z.preprocess(emptyToUndefined, z.string().optional()),
  event_time_start: optionalText(255),
  event_time_end: optionalText(255),
  venue_name: optionalText(255),
  venue_address: z.preprocess(emptyToUndefined, z.string().optional()),
  venue_city: optionalText(255),
  venue_maps_url: z.preprocess(
    emptyToUndefined,
    z.string().url('The venue maps url field must be a valid URL.').optional(),
  ),
  venue_latitude: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
  venue_longitude: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
  instagram_bride: optionalText(255),
  instagram_groom: optionalText(255),
  love_story: z.preprocess(emptyToUndefined, z.string().optional()),
  background_music: optionalText(255),
});

export type EventSettingsInput = z.infer<typeof eventSettingsSchema>;
