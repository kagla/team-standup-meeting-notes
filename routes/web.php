<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StandupNoteController;
use App\Http\Controllers\TeamMemberController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/team-members', [TeamMemberController::class, 'index'])->name('team-members.index');
    Route::post('/team-members', [TeamMemberController::class, 'store'])->name('team-members.store');
    Route::delete('/team-members/{teamMember}', [TeamMemberController::class, 'destroy'])->name('team-members.destroy');

    Route::get('/standup-notes', [StandupNoteController::class, 'index'])->name('standup-notes.index');
    Route::get('/standup-notes/calendar', [StandupNoteController::class, 'calendar'])->name('standup-notes.calendar');
    Route::get('/standup-notes/history', [StandupNoteController::class, 'history'])->name('standup-notes.history');
    Route::get('/standup-notes/create', [StandupNoteController::class, 'create'])->name('standup-notes.create');
    Route::post('/standup-notes', [StandupNoteController::class, 'store'])->name('standup-notes.store');
    Route::patch('/standup-notes/{standupNote}/status', [StandupNoteController::class, 'update'])->name('standup-notes.update-status');
});

require __DIR__.'/auth.php';
