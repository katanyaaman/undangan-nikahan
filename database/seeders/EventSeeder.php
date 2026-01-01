<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Event::create([
            'event_type' => 'wedding',
            'bride_name' => 'Sarah Johnson',
            'bride_father' => 'Mr. Michael Johnson',
            'bride_mother' => 'Mrs. Emily Johnson',
            'groom_name' => 'David Anderson',
            'groom_father' => 'Mr. Robert Anderson',
            'groom_mother' => 'Mrs. Jennifer Anderson',
            'event_title' => 'The Wedding of Sarah & David',
            'event_description' => 'Join us as we celebrate our love and commitment to each other',
            'event_date' => '2025-12-31 19:00:00',
            'event_time_start' => '19:00:00',
            'event_time_end' => '22:00:00',
            'venue_name' => 'Grand Ballroom Hotel',
            'venue_address' => 'Jl. Sudirman No. 123, Jakarta Pusat',
            'venue_city' => 'Jakarta',
            'venue_maps_url' => 'https://maps.google.com/?q=-6.200000,106.816666',
            'venue_latitude' => -6.200000,
            'venue_longitude' => 106.816666,
            'instagram_bride' => '@sarahjohnson',
            'instagram_groom' => '@davidanderson',
            'love_story' => 'We met in the autumn of 2020, and since then, every moment has been a beautiful journey together.',
            'background_music' => 'wedding-song.mp3',
            'is_active' => true,
        ]);
    }
}
