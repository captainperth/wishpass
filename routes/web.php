<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\GameController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Wishlist routes
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist', [WishlistController::class, 'store'])->name('wishlist.store');
    Route::patch('/wishlist/{game}', [WishlistController::class, 'update'])->name('wishlist.update');
    Route::delete('/wishlist/{game}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
    Route::post('/wishlist/sync-steam', [WishlistController::class, 'syncSteam'])->name('wishlist.sync-steam');
    Route::post('/wishlist/check-sales', [WishlistController::class, 'checkSales'])->name('wishlist.check-sales');

    // Game routes
    Route::get('/games', [GameController::class, 'index'])->name('games.index');
    Route::get('/games/{game}', [GameController::class, 'show'])->name('games.show');
    Route::get('/api/games/search', [GameController::class, 'search'])->name('games.search');
    Route::post('/api/games/add-from-steam', [GameController::class, 'addFromSteam'])->name('games.add-from-steam');
});

require __DIR__.'/auth.php';
