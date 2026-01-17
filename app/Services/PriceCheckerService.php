<?php

namespace App\Services;

use App\Models\Game;
use App\Models\GamePrice;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PriceCheckerService
{
    protected string $cheapSharkBaseUrl = 'https://www.cheapshark.com/api/1.0';

    /**
     * Check prices for a game across multiple stores
     */
    public function checkPrices(Game $game): array
    {
        $prices = [];

        // Check Steam price if available
        if ($game->steam_app_id) {
            $steamPrice = $this->getSteamPrice($game->steam_app_id);
            if ($steamPrice) {
                $prices[] = $steamPrice;
            }
        }

        // Check CheapShark for other store prices
        $cheapSharkPrices = $this->getCheapSharkPrices($game->title);
        $prices = array_merge($prices, $cheapSharkPrices);

        return $prices;
    }

    /**
     * Get Steam price information
     */
    protected function getSteamPrice(string $appId): ?array
    {
        try {
            $response = Http::get("https://store.steampowered.com/api/appdetails", [
                'appids' => $appId,
                'filters' => 'price_overview'
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data[$appId]['data']['price_overview'])) {
                    $priceData = $data[$appId]['data']['price_overview'];
                    
                    return [
                        'store' => 'Steam',
                        'current_price' => $priceData['final'] / 100,
                        'original_price' => $priceData['initial'] / 100,
                        'discount_percent' => $priceData['discount_percent'],
                        'is_on_sale' => $priceData['discount_percent'] > 0,
                        'currency' => $priceData['currency'],
                        'store_url' => "https://store.steampowered.com/app/{$appId}",
                    ];
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Failed to get Steam price: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get prices from CheapShark API
     */
    protected function getCheapSharkPrices(string $gameTitle): array
    {
        try {
            $response = Http::get("{$this->cheapSharkBaseUrl}/deals", [
                'title' => $gameTitle,
                'pageSize' => 10
            ]);

            if ($response->successful()) {
                $deals = $response->json();
                $prices = [];

                foreach ($deals as $deal) {
                    $prices[] = [
                        'store' => $this->getStoreName($deal['storeID']),
                        'current_price' => (float) $deal['salePrice'],
                        'original_price' => (float) $deal['normalPrice'],
                        'discount_percent' => (int) round((float) $deal['savings']),
                        'is_on_sale' => (float) $deal['savings'] > 0,
                        'currency' => 'USD',
                        'store_url' => "https://www.cheapshark.com/redirect?dealID={$deal['dealID']}",
                    ];
                }

                return $prices;
            }

            return [];
        } catch (\Exception $e) {
            Log::error('Failed to get CheapShark prices: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Update prices for a game in the database
     */
    public function updateGamePrices(Game $game): int
    {
        $prices = $this->checkPrices($game);
        $updatedCount = 0;

        foreach ($prices as $priceData) {
            GamePrice::updateOrCreate(
                [
                    'game_id' => $game->id,
                    'store' => $priceData['store']
                ],
                $priceData
            );
            $updatedCount++;
        }

        return $updatedCount;
    }

    /**
     * Get store name from CheapShark store ID
     */
    protected function getStoreName(string $storeId): string
    {
        $stores = [
            '1' => 'Steam',
            '2' => 'GamersGate',
            '3' => 'GreenManGaming',
            '7' => 'GOG',
            '8' => 'Origin',
            '11' => 'Humble Store',
            '13' => 'Uplay',
            '15' => 'Fanatical',
            '25' => 'Epic Games Store',
        ];

        return $stores[$storeId] ?? 'Unknown Store';
    }

    /**
     * Check if any games in user's wishlist are on sale
     */
    public function checkWishlistSales(int $userId): array
    {
        $user = \App\Models\User::with('games')->find($userId);
        $gamesOnSale = [];

        foreach ($user->games as $game) {
            $this->updateGamePrices($game);
            
            if ($game->isOnSale()) {
                $gamesOnSale[] = [
                    'game' => $game,
                    'best_price' => $game->getCurrentPrice()
                ];
            }
        }

        return $gamesOnSale;
    }
}
