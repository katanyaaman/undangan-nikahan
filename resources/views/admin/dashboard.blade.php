@extends('admin.layouts.app')

@section('title', 'Dashboard')

@section('content')
<!-- Stats Cards -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <!-- Total Guests -->
    <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-gray-600 mb-1">Total Tamu</p>
                <p class="text-3xl font-bold text-gray-800">{{ $totalGuests }}</p>
            </div>
            <div class="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                <svg class="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
            </div>
        </div>
    </div>

    <!-- Attending Guests -->
    <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-gray-600 mb-1">Hadir</p>
                <p class="text-3xl font-bold text-green-600">{{ $attendingGuests }}</p>
            </div>
            <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
        </div>
    </div>

    <!-- Not Attending Guests -->
    <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-gray-600 mb-1">Tidak Hadir</p>
                <p class="text-3xl font-bold text-red-600">{{ $notAttendingGuests }}</p>
            </div>
            <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
        </div>
    </div>

    <!-- Undecided Guests -->
    <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-gray-600 mb-1">Masih Ragu</p>
                <p class="text-3xl font-bold text-yellow-600">{{ $undecidedGuests }}</p>
            </div>
            <div class="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg class="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
        </div>
    </div>
</div>

<!-- Charts & Tables Row -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
    <!-- Attendance Breakdown Chart -->
    <div class="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-6">Attendance Breakdown</h3>
        <div class="space-y-4">
            @php
                $total = $totalGuests > 0 ? $totalGuests : 1;
            @endphp

            <!-- Hadir -->
            <div>
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">Hadir</span>
                    <span class="font-medium text-gray-800">{{ $attendingGuests }} ({{ number_format(($attendingGuests / $total) * 100, 1) }}%)</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                    <div class="bg-green-500 h-3 rounded-full transition-all duration-500" style="width: {{ ($attendingGuests / $total) * 100 }}%"></div>
                </div>
            </div>

            <!-- Tidak Hadir -->
            <div>
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">Tidak Hadir</span>
                    <span class="font-medium text-gray-800">{{ $notAttendingGuests }} ({{ number_format(($notAttendingGuests / $total) * 100, 1) }}%)</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                    <div class="bg-red-500 h-3 rounded-full transition-all duration-500" style="width: {{ ($notAttendingGuests / $total) * 100 }}%"></div>
                </div>
            </div>

            <!-- Masih Ragu -->
            <div>
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">Masih Ragu</span>
                    <span class="font-medium text-gray-800">{{ $undecidedGuests }} ({{ number_format(($undecidedGuests / $total) * 100, 1) }}%)</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                    <div class="bg-yellow-500 h-3 rounded-full transition-all duration-500" style="width: {{ ($undecidedGuests / $total) * 100 }}%"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
        <div class="space-y-3">
            <a href="{{ route('admin.guests') }}" class="block w-full bg-primary-50 hover:bg-primary-100 text-primary-700 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Manage Guests
            </a>

            <a href="{{ route('admin.guests.export') }}" class="block w-full bg-green-50 hover:bg-green-100 text-green-700 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Export to CSV
            </a>

            <a href="{{ route('home') }}" target="_blank" class="block w-full bg-gold-50 hover:bg-gold-100 text-gold-700 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                View Site
            </a>
        </div>
    </div>
</div>

<!-- Recent Guests -->
<div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div class="p-6 border-b border-gray-100">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800">Recent Guests</h3>
            <a href="{{ route('admin.guests') }}" class="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
                View All →
            </a>
        </div>
    </div>

    <div class="overflow-x-auto">
        <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-100">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
                @forelse($recentGuests as $guest)
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{{ $guest->name }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500">{{ $guest->email ?? '-' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        @if($guest->attendance === 'hadir')
                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Hadir
                        </span>
                        @elseif($guest->attendance === 'tidak_hadir')
                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Tidak Hadir
                        </span>
                        @else
                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Masih Ragu
                        </span>
                        @endif
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ $guest->number_of_guests ?? 1 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ $guest->created_at->format('d M Y, H:i') }}
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="px-6 py-12 text-center">
                        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                        </svg>
                        <p class="text-gray-500">Belum ada tamu yang terdaftar</p>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
