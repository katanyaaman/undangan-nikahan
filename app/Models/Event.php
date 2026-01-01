<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_type',
        'bride_name',
        'bride_father',
        'bride_mother',
        'groom_name',
        'groom_father',
        'groom_mother',
        'event_title',
        'event_description',
        'event_date',
        'event_time_start',
        'event_time_end',
        'venue_name',
        'venue_address',
        'venue_city',
        'venue_maps_url',
        'venue_latitude',
        'venue_longitude',
        'instagram_bride',
        'instagram_groom',
        'love_story',
        'gallery_folder',
        'background_music',
        'is_active',
    ];

    protected $casts = [
        'event_date' => 'datetime',
        'event_time_start' => 'datetime',
        'event_time_end' => 'datetime',
        'is_active' => 'boolean',
        'venue_latitude' => 'decimal:8',
        'venue_longitude' => 'decimal:8',
    ];

    /**
     * Get the active event
     */
    public static function getActive()
    {
        return self::where('is_active', true)->first() ?? self::first();
    }
}
