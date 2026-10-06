/** Tipe baris tabel guests. */
export interface GuestRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  number_of_guests: number;
  message: string | null;
  attendance: string;
  is_confirmed: number;
  event_id: number | null;
  created_at: string;
  updated_at: string;
}

/** Tipe baris tabel events. */
export interface EventRow {
  id: number;
  customer_id: number | null;
  template_slug: string;
  slug: string | null;
  status: string;
  paid_at: string | null;
  expired_at: string | null;
  event_type: string;
  bride_name: string | null;
  bride_father: string | null;
  bride_mother: string | null;
  groom_name: string | null;
  groom_father: string | null;
  groom_mother: string | null;
  event_title: string | null;
  event_description: string | null;
  event_date: string | null;
  event_time_start: string | null;
  event_time_end: string | null;
  venue_name: string | null;
  venue_address: string | null;
  venue_city: string | null;
  venue_maps_url: string | null;
  venue_latitude: number | null;
  venue_longitude: number | null;
  instagram_bride: string | null;
  instagram_groom: string | null;
  love_story: string | null;
  gallery_folder: string | null;
  background_music: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateRow {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  preview_image: string | null;
  active: number;
  sort_order: number;
  demo_bride: string | null;
  demo_groom: string | null;
  demo_date: string | null;
  demo_venue: string | null;
  demo_address: string | null;
  demo_bride_father: string | null;
  demo_bride_mother: string | null;
  demo_groom_father: string | null;
  demo_groom_mother: string | null;
  demo_instagram_bride: string | null;
  demo_instagram_groom: string | null;
  demo_bride_photo: string | null;
  demo_groom_photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerTemplateRow {
  id: number;
  customer_id: number;
  template_slug: string;
  source: string;
  granted_by: number | null;
  created_at: string;
}

export interface PaymentRow {
  id: number;
  event_id: number;
  amount: number;
  method: string;
  proof_image: string | null;
  status: string;
  verified_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface PhotoRow {
  id: number;
  event_id: number;
  kind: string;
  url: string;
  sort_order: number;
  created_at: string;
}
