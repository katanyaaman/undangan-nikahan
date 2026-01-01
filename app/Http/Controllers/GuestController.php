<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function index()
    {
        $guests = Guest::latest()->paginate(20);
        return view('admin.guests.index', compact('guests'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:guests,email',
            'phone' => 'nullable|string|max:20',
            'number_of_guests' => 'required|integer|min:1|max:5',
            'message' => 'nullable|string|max:1000',
            'attendance' => 'required|in:hadir,tidak_hadir',
        ]);

        $guest = Guest::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Terima kasih! RSVP Anda telah berhasil dikirim.',
            'data' => $guest
        ], 201);
    }

    public function show(Guest $guest)
    {
        return response()->json($guest);
    }

    public function update(Request $request, Guest $guest)
    {
        $validated = $request->validate([
            'is_confirmed' => 'boolean',
        ]);

        $guest->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Guest updated successfully',
            'data' => $guest
        ]);
    }

    public function destroy(Guest $guest)
    {
        $guest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Guest deleted successfully'
        ]);
    }
}
