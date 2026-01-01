<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'number_of_guests',
        'message',
        'attendance',
        'is_confirmed',
    ];

    protected $casts = [
        'is_confirmed' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
