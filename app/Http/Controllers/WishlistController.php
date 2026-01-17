<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Wishlist;
use App\Services\PriceCheckerService;
use App\Services\SteamService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function __construct(
        protected SteamService $steamService,
        protected PriceCheckerService $priceChecker
    ) {}

    /**
     * Display the user's wishlist
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        $wishlist = $user->games()
            ->with(['prices' => function($query) {
                $query->where('is_on_sale', true)
                    ->orWhere(function($q) {
                        $q->whereNull('is_on_sale')
                          ->orWhere('is_on_sale', false);
                    })
                    ->orderBy('is_on_sale', 'desc')
                    ->orderBy('current_price', 'asc');
            }, 'services'])
            ->orderBy('wishlists.priority', 'desc')
            ->get()
            ->map(function($game) {
                return [
                    'id' => $game->id,
                    'title' => $game->title,
                    'description' => $game->description,
                    'cover_image' => $game->cover_image,
                    'platforms' => $game->platforms,
                    'genres' => $game->genres,
                    'release_date' => $game->release_date?->format('Y-m-d'),
                    'developer' => $game->developer,
                    'publisher' => $game->publisher,
                    'priority' => $game->pivot->priority,
                    'notes' => $game->pivot->notes,
                    'is_on_sale' => $game->isOnSale(),
                    'current_price' => $game->getCurrentPrice(),
                    'prices' => $game->prices,
                    'services' => $game->services->where('is_available', true),
                ];
            });

        return Inertia::render('Wishlist/Index', [
            'wishlist' => $wishlist,
            'has_steam_id' => !empty($user->steam_id),
        ]);
    }

    /**
     * Add a game to the wishlist
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'game_id' => 'required|exists:games,id',
            'priority' => 'nullable|integer|min:0|max:10',
            'notes' => 'nullable|string|max:500',
        ]);

        $user = $request->user();
        
        // Check if already in wishlist
        if ($user->games()->where('game_id', $validated['game_id'])->exists()) {
            return back()->with('error', 'Game is already in your wishlist');
        }

        $user->games()->attach($validated['game_id'], [
            'priority' => $validated['priority'] ?? 0,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Update prices for this game
        $game = Game::find($validated['game_id']);
        $this->priceChecker->updateGamePrices($game);

        return back()->with('success', 'Game added to wishlist');
    }

    /**
     * Update wishlist item
     */
    public function update(Request $request, Game $game)
    {
        $validated = $request->validate([
            'priority' => 'nullable|integer|min:0|max:10',
            'notes' => 'nullable|string|max:500',
        ]);

        $user = $request->user();
        
        $user->games()->updateExistingPivot($game->id, [
            'priority' => $validated['priority'] ?? 0,
            'notes' => $validated['notes'] ?? null,
        ]);

        return back()->with('success', 'Wishlist item updated');
    }

    /**
     * Remove game from wishlist
     */
    public function destroy(Request $request, Game $game)
    {
        $request->user()->games()->detach($game->id);
        
        return back()->with('success', 'Game removed from wishlist');
    }

    /**
     * Sync with Steam wishlist
     */
    public function syncSteam(Request $request)
    {
        $user = $request->user();
        
        if (!$user->steam_id) {
            return back()->with('error', 'Please set your Steam ID in profile settings');
        }

        $syncedCount = $this->steamService->syncWishlist($user);

        return back()->with('success', "Synced {$syncedCount} games from Steam");
    }

    /**
     * Check for sales on wishlist games
     */
    public function checkSales(Request $request)
    {
        $gamesOnSale = $this->priceChecker->checkWishlistSales($request->user()->id);

        return back()->with('success', 'Prices updated')->with('sales', $gamesOnSale);
    }
}

