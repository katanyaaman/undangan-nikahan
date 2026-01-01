<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    /**
     * Homepage - Template Selector
     */
    public function home()
    {
        return view('home');
    }

    /**
     * Template 1 - Elegant Modern
     */
    public function template1()
    {
        $data = $this->getInvitationData();
        return view('templates.template-1.index', $data);
    }

    /**
     * Template 2 - Classic Romantic
     */
    public function template2()
    {
        $data = $this->getInvitationData();
        return view('templates.template-2.index', $data);
    }

    /**
     * Template 3 - Elegant Nature
     */
    public function template3()
    {
        $data = $this->getInvitationData();
        return view('templates.template-3.index', $data);
    }

    /**
     * Template 4 - Bugis Emerald
     */
    public function template4()
    {
        $data = $this->getInvitationData();
        return view('templates.template-4.index', $data);
    }

    /**
     * Get common invitation data
     */
    private function getInvitationData()
    {
        $eventDate = '2025-12-31 19:00:00';
        $confirmedGuests = Guest::where('is_confirmed', true)->count();
        $totalCapacity = 200;

        // Guest Book data
        $wishes = Guest::whereNotNull('message')
            ->where('message', '!=', '')
            ->latest()
            ->paginate(10);

        $totalWishes = Guest::whereNotNull('message')->where('message', '!=', '')->count();
        $attendingCount = Guest::where('attendance', 'hadir')->count();
        $notAttendingCount = Guest::where('attendance', 'tidak_hadir')->count();
        $totalGuests = Guest::where('attendance', 'hadir')->sum('number_of_guests');

        return compact(
            'eventDate',
            'confirmedGuests',
            'totalCapacity',
            'wishes',
            'totalWishes',
            'attendingCount',
            'notAttendingCount',
            'totalGuests'
        );
    }
}
