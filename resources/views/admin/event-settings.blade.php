@extends('admin.layouts.app')

@section('title', 'Event Settings')
@section('subtitle', 'Manage event and couple information')

@section('content')
<div class="max-w-5xl mx-auto">
    <!-- Back Button -->
    <div class="mb-6">
        <a href="{{ route('admin.settings') }}" class="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Settings
        </a>
    </div>

    <form method="POST" action="{{ route('admin.event-settings.update') }}" class="space-y-6">
        @csrf
        @method('PUT')

        <!-- Event Type -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Event Type</h3>

            <div class="grid md:grid-cols-5 gap-4">
                <label class="relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all {{ old('event_type', $event->event_type ?? 'wedding') === 'wedding' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300' }}">
                    <input type="radio" name="event_type" value="wedding" class="sr-only" {{ old('event_type', $event->event_type ?? 'wedding') === 'wedding' ? 'checked' : '' }}>
                    <div class="text-center">
                        <svg class="w-8 h-8 mx-auto mb-2 {{ old('event_type', $event->event_type ?? 'wedding') === 'wedding' ? 'text-primary-600' : 'text-gray-400' }}" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="text-sm font-medium {{ old('event_type', $event->event_type ?? 'wedding') === 'wedding' ? 'text-primary-600' : 'text-gray-600' }}">Wedding</span>
                    </div>
                </label>

                <label class="relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all {{ old('event_type', $event->event_type ?? '') === 'seminar' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300' }}">
                    <input type="radio" name="event_type" value="seminar" class="sr-only" {{ old('event_type', $event->event_type ?? '') === 'seminar' ? 'checked' : '' }}>
                    <div class="text-center">
                        <svg class="w-8 h-8 mx-auto mb-2 {{ old('event_type', $event->event_type ?? '') === 'seminar' ? 'text-primary-600' : 'text-gray-400' }}" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                        </svg>
                        <span class="text-sm font-medium {{ old('event_type', $event->event_type ?? '') === 'seminar' ? 'text-primary-600' : 'text-gray-600' }}">Seminar</span>
                    </div>
                </label>

                <label class="relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all {{ old('event_type', $event->event_type ?? '') === 'aqiqah' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300' }}">
                    <input type="radio" name="event_type" value="aqiqah" class="sr-only" {{ old('event_type', $event->event_type ?? '') === 'aqiqah' ? 'checked' : '' }}>
                    <div class="text-center">
                        <svg class="w-8 h-8 mx-auto mb-2 {{ old('event_type', $event->event_type ?? '') === 'aqiqah' ? 'text-primary-600' : 'text-gray-400' }}" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                        </svg>
                        <span class="text-sm font-medium {{ old('event_type', $event->event_type ?? '') === 'aqiqah' ? 'text-primary-600' : 'text-gray-600' }}">Aqiqah</span>
                    </div>
                </label>

                <label class="relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all {{ old('event_type', $event->event_type ?? '') === 'birthday' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300' }}">
                    <input type="radio" name="event_type" value="birthday" class="sr-only" {{ old('event_type', $event->event_type ?? '') === 'birthday' ? 'checked' : '' }}>
                    <div class="text-center">
                        <svg class="w-8 h-8 mx-auto mb-2 {{ old('event_type', $event->event_type ?? '') === 'birthday' ? 'text-primary-600' : 'text-gray-400' }}" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="text-sm font-medium {{ old('event_type', $event->event_type ?? '') === 'birthday' ? 'text-primary-600' : 'text-gray-600' }}">Birthday</span>
                    </div>
                </label>

                <label class="relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all {{ old('event_type', $event->event_type ?? '') === 'other' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300' }}">
                    <input type="radio" name="event_type" value="other" class="sr-only" {{ old('event_type', $event->event_type ?? '') === 'other' ? 'checked' : '' }}>
                    <div class="text-center">
                        <svg class="w-8 h-8 mx-auto mb-2 {{ old('event_type', $event->event_type ?? '') === 'other' ? 'text-primary-600' : 'text-gray-400' }}" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="text-sm font-medium {{ old('event_type', $event->event_type ?? '') === 'other' ? 'text-primary-600' : 'text-gray-600' }}">Other</span>
                    </div>
                </label>
            </div>
        </div>

        <!-- Bride & Groom Information -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Bride & Groom Information</h3>

            <div class="grid md:grid-cols-2 gap-6">
                <!-- Bride Section -->
                <div class="space-y-4">
                    <h4 class="font-medium text-gray-700 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                        </svg>
                        Bride
                    </h4>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Bride Name</label>
                        <input type="text" name="bride_name" value="{{ old('bride_name', $event->bride_name ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Sarah Johnson">
                        @error('bride_name')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
                        <input type="text" name="bride_father" value="{{ old('bride_father', $event->bride_father ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Mr. Michael Johnson">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Mother's Name</label>
                        <input type="text" name="bride_mother" value="{{ old('bride_mother', $event->bride_mother ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Mrs. Emily Johnson">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                        <input type="text" name="instagram_bride" value="{{ old('instagram_bride', $event->instagram_bride ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="@sarahjohnson">
                    </div>
                </div>

                <!-- Groom Section -->
                <div class="space-y-4">
                    <h4 class="font-medium text-gray-700 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                        </svg>
                        Groom
                    </h4>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Groom Name</label>
                        <input type="text" name="groom_name" value="{{ old('groom_name', $event->groom_name ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="David Anderson">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
                        <input type="text" name="groom_father" value="{{ old('groom_father', $event->groom_father ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Mr. Robert Anderson">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Mother's Name</label>
                        <input type="text" name="groom_mother" value="{{ old('groom_mother', $event->groom_mother ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Mrs. Jennifer Anderson">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                        <input type="text" name="instagram_groom" value="{{ old('instagram_groom', $event->instagram_groom ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="@davidanderson">
                    </div>
                </div>
            </div>
        </div>

        <!-- Event Details -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Event Details</h3>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                    <input type="text" name="event_title" value="{{ old('event_title', $event->event_title ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="The Wedding of Sarah & David">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Event Description</label>
                    <textarea name="event_description" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Join us as we celebrate our love and commitment to each other">{{ old('event_description', $event->event_description ?? '') }}</textarea>
                </div>

                <div class="grid md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                        <input type="date" name="event_date" value="{{ old('event_date', $event->event_date ? $event->event_date->format('Y-m-d') : '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                        <input type="time" name="event_time_start" value="{{ old('event_time_start', $event->event_time_start ? $event->event_time_start->format('H:i') : '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                        <input type="time" name="event_time_end" value="{{ old('event_time_end', $event->event_time_end ? $event->event_time_end->format('H:i') : '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Love Story</label>
                    <textarea name="love_story" rows="4" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Tell your story...">{{ old('love_story', $event->love_story ?? '') }}</textarea>
                </div>
            </div>
        </div>

        <!-- Venue Information -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Venue Information</h3>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Venue Name</label>
                    <input type="text" name="venue_name" value="{{ old('venue_name', $event->venue_name ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Grand Ballroom Hotel">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Venue Address</label>
                    <textarea name="venue_address" rows="2" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Jl. Sudirman No. 123">{{ old('venue_address', $event->venue_address ?? '') }}</textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input type="text" name="venue_city" value="{{ old('venue_city', $event->venue_city ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Jakarta">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Google Maps URL</label>
                    <input type="url" name="venue_maps_url" value="{{ old('venue_maps_url', $event->venue_maps_url ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="https://maps.google.com/?q=-6.200000,106.816666">
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                        <input type="text" name="venue_latitude" value="{{ old('venue_latitude', $event->venue_latitude ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="-6.200000">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                        <input type="text" name="venue_longitude" value="{{ old('venue_longitude', $event->venue_longitude ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="106.816666">
                    </div>
                </div>
            </div>
        </div>

        <!-- Additional Settings -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Additional Settings</h3>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Background Music (filename)</label>
                    <input type="text" name="background_music" value="{{ old('background_music', $event->background_music ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="wedding-song.mp3">
                    <p class="mt-1 text-sm text-gray-500">Upload music file to public/music/ folder</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Gallery Folder</label>
                    <input type="text" name="gallery_folder" value="{{ old('gallery_folder', $event->gallery_folder ?? '') }}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="wedding-photos">
                    <p class="mt-1 text-sm text-gray-500">Upload photos to public/gallery/{folder}/ folder</p>
                </div>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <a href="{{ route('admin.settings') }}" class="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Cancel
            </a>

            <button type="submit" class="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Save Event Settings
            </button>
        </div>
    </form>
</div>
@endsection
