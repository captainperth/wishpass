<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Services\PriceCheckerService;
use App\Services\SteamService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    public function __construct(
        protected SteamService $steamService,
        protected PriceCheckerService $priceChecker
    ) {}

    /**
     * Display game search/browse page
     */
    public function index(Request $request): Response
    {
        $query = Game::with(['prices', 'services']);

        // Search functionality
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        // Filter by genre
        if ($request->has('genre')) {
            $genre = $request->input('genre');
            $query->whereJsonContains('genres', $genre);
        }

        // Filter by platform
        if ($request->has('platform')) {
            $platform = $request->input('platform');
            $query->whereJsonContains('platforms', $platform);
        }

        // Filter for games on sale
        if ($request->boolean('on_sale')) {
            $query->whereHas('prices', function($q) {
                $q->where('is_on_sale', true);
            });
        }

        $games = $query->paginate(20)->through(function($game) use ($request) {
            $user = $request->user();
            $inWishlist = $user ? $user->games()->where('game_id', $game->id)->exists() : false;

            return [
                'id' => $game->id,
                'title' => $game->title,
                'description' => substr($game->description ?? '', 0, 200),
                'cover_image' => $game->cover_image,
                'platforms' => $game->platforms,
                'genres' => $game->genres,
                'release_date' => $game->release_date?->format('Y-m-d'),
                'is_on_sale' => $game->isOnSale(),
                'current_price' => $game->getCurrentPrice(),
                'in_wishlist' => $inWishlist,
            ];
        });

        return Inertia::render('Games/Index', [
            'games' => $games,
            'filters' => $request->only(['search', 'genre', 'platform', 'on_sale']),
        ]);
    }

    /**
     * Display a specific game
     */
    public function show(Request $request, Game $game): Response
    {
        $game->load(['prices', 'services']);
        
        $user = $request->user();
        $inWishlist = $user ? $user->games()->where('game_id', $game->id)->exists() : false;

        return Inertia::render('Games/Show', [
            'game' => [
                'id' => $game->id,
                'title' => $game->title,
                'description' => $game->description,
                'cover_image' => $game->cover_image,
                'platforms' => $game->platforms,
                'genres' => $game->genres,
                'release_date' => $game->release_date?->format('Y-m-d'),
                'developer' => $game->developer,
                'publisher' => $game->publisher,
                'steam_app_id' => $game->steam_app_id,
                'is_on_sale' => $game->isOnSale(),
                'prices' => $game->prices,
                'services' => $game->services->where('is_available', true),
                'in_wishlist' => $inWishlist,
            ],
        ]);
    }

    /**
     * Search for games (API endpoint for autocomplete)
     */
    public function search(Request $request)
    {
        $query = $request->input('q');
        
        if (empty($query)) {
            return response()->json([]);
        }

        // Search local database first
        $localGames = Game::where('title', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id', 'title', 'cover_image', 'steam_app_id']);

        // If we need more results, search Steam
        if ($localGames->count() < 5) {
            $steamResults = $this->steamService->searchGames($query);
            
            // Add Steam results that aren't in our database
            foreach ($steamResults as $result) {
                if (isset($result['appid'])) {
                    $exists = Game::where('steam_app_id', $result['appid'])->exists();
                    if (!$exists) {
                        $localGames->push([
                            'id' => null,
                            'title' => $result['name'],
                            'steam_app_id' => $result['appid'],
                            'cover_image' => null,
                        ]);
                    }
                }
            }
        }

        return response()->json($localGames);
    }

    /**
     * Add a new game from Steam
     */
    public function addFromSteam(Request $request)
    {
        $validated = $request->validate([
            'steam_app_id' => 'required|string',
        ]);

        // Check if game already exists
        $game = Game::where('steam_app_id', $validated['steam_app_id'])->first();
        
        if ($game) {
            return response()->json(['game' => $game, 'message' => 'Game already exists']);
        }

        // Fetch from Steam
        $gameData = $this->steamService->getGameDetails($validated['steam_app_id']);
        
        if (!$gameData) {
            return response()->json(['error' => 'Failed to fetch game from Steam'], 404);
        }

        // Create game
        $game = Game::create([
            'title' => $gameData['name'] ?? 'Unknown',
            'description' => strip_tags($gameData['short_description'] ?? ''),
            'steam_app_id' => $validated['steam_app_id'],
            'cover_image' => $gameData['header_image'] ?? null,
            'platforms' => $gameData['platforms'] ?? [],
            'genres' => collect($gameData['genres'] ?? [])->pluck('description')->toArray(),
            'release_date' => isset($gameData['release_date']['date']) 
                ? date('Y-m-d', strtotime($gameData['release_date']['date'])) 
                : null,
            'developer' => implode(', ', $gameData['developers'] ?? []),
            'publisher' => implode(', ', $gameData['publishers'] ?? []),
        ]);

        // Update prices
        $this->priceChecker->updateGamePrices($game);

        return response()->json(['game' => $game, 'message' => 'Game added successfully']);
    }
}

