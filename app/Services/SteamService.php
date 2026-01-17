<?php

namespace App\Services;

use App\Models\Game;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SteamService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.steampowered.com';

    public function __construct()
    {
        $this->apiKey = config('services.steam.api_key', '');
    }

    /**
     * Get user's Steam wishlist
     */
    public function getUserWishlist(string $steamId): array
    {
        try {
            $response = Http::get("https://store.steampowered.com/wishlist/profiles/{$steamId}/wishlistdata/");
            
            if ($response->successful()) {
                return $response->json();
            }
            
            Log::error('Failed to fetch Steam wishlist', [
                'steam_id' => $steamId,
                'status' => $response->status()
            ]);
            
            return [];
        } catch (\Exception $e) {
            Log::error('Steam API error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get game details from Steam
     */
    public function getGameDetails(string $appId): ?array
    {
        try {
            $response = Http::get("https://store.steampowered.com/api/appdetails", [
                'appids' => $appId
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                if (isset($data[$appId]['success']) && $data[$appId]['success']) {
                    return $data[$appId]['data'];
                }
            }
            
            return null;
        } catch (\Exception $e) {
            Log::error('Failed to get Steam game details: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Sync Steam wishlist with user's wishlist
     */
    public function syncWishlist(User $user): int
    {
        if (!$user->steam_id) {
            return 0;
        }

        $steamWishlist = $this->getUserWishlist($user->steam_id);
        $syncedCount = 0;

        foreach ($steamWishlist as $appId => $gameData) {
            // Find or create game
            $game = Game::firstOrCreate(
                ['steam_app_id' => $appId],
                [
                    'title' => $gameData['name'] ?? 'Unknown',
                    'description' => strip_tags($gameData['short_description'] ?? ''),
                    'cover_image' => $gameData['capsule'] ?? null,
                    'release_date' => isset($gameData['release_date']) 
                        ? date('Y-m-d', $gameData['release_date']) 
                        : null,
                ]
            );

            // Add to user's wishlist if not already present
            if (!$user->games()->where('game_id', $game->id)->exists()) {
                $user->games()->attach($game->id);
                $syncedCount++;
            }
        }

        return $syncedCount;
    }

    /**
     * Search for games on Steam
     */
    public function searchGames(string $query): array
    {
        try {
            // Use Steam's search API
            $response = Http::get('https://steamcommunity.com/actions/SearchApps/' . urlencode($query));
            
            if ($response->successful()) {
                return $response->json();
            }
            
            return [];
        } catch (\Exception $e) {
            Log::error('Steam search error: ' . $e->getMessage());
            return [];
        }
    }
}
