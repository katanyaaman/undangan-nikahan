<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Show admin dashboard.
     */
    public function dashboard()
    {
        // Get statistics
        $totalGuests = Guest::count();
        $confirmedGuests = Guest::where('is_confirmed', true)->count();
        $attendingGuests = Guest::where('attendance', 'hadir')->count();
        $notAttendingGuests = Guest::where('attendance', 'tidak_hadir')->count();
        $undecidedGuests = Guest::where('attendance', 'masih_ragu')->count();

        // Get recent guests
        $recentGuests = Guest::orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Get attendance breakdown
        $attendanceStats = Guest::select('attendance', DB::raw('count(*) as total'))
            ->groupBy('attendance')
            ->get();

        // Get daily registrations (last 7 days)
        $dailyRegistrations = Guest::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as total')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return view('admin.dashboard', compact(
            'totalGuests',
            'confirmedGuests',
            'attendingGuests',
            'notAttendingGuests',
            'undecidedGuests',
            'recentGuests',
            'attendanceStats',
            'dailyRegistrations'
        ));
    }

    /**
     * Show all guests.
     */
    public function guests(Request $request)
    {
        $query = Guest::query();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Attendance filter
        if ($request->filled('attendance')) {
            $query->where('attendance', $request->input('attendance'));
        }

        // Sort
        $sortBy = $request->input('sort', 'created_at');
        $sortOrder = $request->input('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginate
        $guests = $query->paginate(20);

        return view('admin.guests.index', compact('guests'));
    }

    /**
     * Show guest details.
     */
    public function showGuest($id)
    {
        $guest = Guest::findOrFail($id);
        return view('admin.guests.show', compact('guest'));
    }

    /**
     * Delete a guest.
     */
    public function deleteGuest($id)
    {
        $guest = Guest::findOrFail($id);
        $guest->delete();

        return redirect()->route('admin.guests')
            ->with('success', 'Tamu berhasil dihapus.');
    }

    /**
     * Export guests to CSV.
     */
    public function exportGuests()
    {
        $guests = Guest::orderBy('created_at', 'desc')->get();

        $filename = 'guests_' . date('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($guests) {
            $file = fopen('php://output', 'w');

            // Header
            fputcsv($file, [
                'ID',
                'Nama',
                'Email',
                'Kehadiran',
                'Jumlah Tamu',
                'Pesan',
                'Tanggal Konfirmasi'
            ]);

            // Data
            foreach ($guests as $guest) {
                fputcsv($file, [
                    $guest->id,
                    $guest->name,
                    $guest->email,
                    $guest->attendance,
                    $guest->number_of_guests,
                    $guest->message,
                    $guest->created_at->format('Y-m-d H:i:s')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Show settings page.
     */
    public function settings()
    {
        $event = Event::getActive();
        return view('admin.settings', compact('event'));
    }

    /**
     * Show event settings edit form.
     */
    public function editEventSettings()
    {
        $event = Event::getActive();

        if (!$event) {
            $event = new Event();
        }

        return view('admin.event-settings', compact('event'));
    }

    /**
     * Update event settings.
     */
    public function updateEventSettings(Request $request)
    {
        $validated = $request->validate([
            'event_type' => 'required|in:wedding,seminar,aqiqah,birthday,other',
            'bride_name' => 'nullable|string|max:255',
            'bride_father' => 'nullable|string|max:255',
            'bride_mother' => 'nullable|string|max:255',
            'groom_name' => 'nullable|string|max:255',
            'groom_father' => 'nullable|string|max:255',
            'groom_mother' => 'nullable|string|max:255',
            'event_title' => 'nullable|string|max:255',
            'event_description' => 'nullable|string',
            'event_date' => 'nullable|date',
            'event_time_start' => 'nullable',
            'event_time_end' => 'nullable',
            'venue_name' => 'nullable|string|max:255',
            'venue_address' => 'nullable|string',
            'venue_city' => 'nullable|string|max:255',
            'venue_maps_url' => 'nullable|url',
            'venue_latitude' => 'nullable|numeric',
            'venue_longitude' => 'nullable|numeric',
            'instagram_bride' => 'nullable|string|max:255',
            'instagram_groom' => 'nullable|string|max:255',
            'love_story' => 'nullable|string',
            'background_music' => 'nullable|string|max:255',
        ]);

        $event = Event::getActive();

        if (!$event) {
            $event = Event::create($validated);
        } else {
            $event->update($validated);
        }

        return redirect()->route('admin.settings')
            ->with('success', 'Pengaturan event berhasil disimpan!');
    }
}
