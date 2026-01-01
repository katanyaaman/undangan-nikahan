<?php

use App\Http\Controllers\InvitationController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;

// Homepage - Template Selector
Route::get('/', [InvitationController::class, 'home'])->name('home');

// Template 1 - Elegant Modern (existing template)
Route::prefix('template-1')->name('template1.')->group(function () {
    Route::get('/', [InvitationController::class, 'template1'])->name('index');
    Route::post('/rsvp', [GuestController::class, 'store'])->name('rsvp.store');
});

// Template 2 - Classic Romantic (new template)
Route::prefix('template-2')->name('template2.')->group(function () {
    Route::get('/', [InvitationController::class, 'template2'])->name('index');
    Route::post('/rsvp', [GuestController::class, 'store'])->name('rsvp.store');
});

// Template 3 - Elegant Nature (nature-inspired template)
Route::prefix('template-3')->name('template3.')->group(function () {
    Route::get('/', [InvitationController::class, 'template3'])->name('index');
    Route::post('/rsvp', [GuestController::class, 'store'])->name('rsvp.store');
});

// Template 4 - Bugis Emerald (traditional Bugis template)
Route::prefix('template-4')->name('template4.')->group(function () {
    Route::get('/', [InvitationController::class, 'template4'])->name('index');
    Route::post('/rsvp', [GuestController::class, 'store'])->name('rsvp.store');
});

// Legacy route redirect
Route::get('/invitation', function () {
    return redirect()->route('template1.index');
});

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);
});

Route::post('/logout', [LoginController::class, 'logout'])->name('logout')->middleware('auth');

// Admin Routes (Protected)
Route::prefix('admin')->name('admin.')->middleware('auth')->group(function () {
    // Dashboard
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard.index');

    // Guests Management
    Route::get('/guests', [AdminController::class, 'guests'])->name('guests');
    Route::get('/guests/{id}', [AdminController::class, 'showGuest'])->name('guests.show');
    Route::delete('/guests/{id}', [AdminController::class, 'deleteGuest'])->name('guests.delete');
    Route::get('/guests/export/csv', [AdminController::class, 'exportGuests'])->name('guests.export');

    // Settings
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');

    // Event Settings
    Route::get('/event-settings', [AdminController::class, 'editEventSettings'])->name('event-settings.edit');
    Route::put('/event-settings', [AdminController::class, 'updateEventSettings'])->name('event-settings.update');
});
