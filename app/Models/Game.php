<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Game extends Model
{
    protected $fillable = [
        'title',
        'description',
        'steam_app_id',
        'cover_image',
        'platforms',
        'genres',
        'release_date',
        'developer',
        'publisher',
    ];

    protected $casts = [
        'platforms' => 'array',
        'genres' => 'array',
        'release_date' => 'date',
    ];

    public function prices(): HasMany
    {
        return $this->hasMany(GamePrice::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(GameService::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'wishlists')
            ->withPivot('priority', 'notes')
            ->withTimestamps();
    }

    public function getCurrentPrice()
    {
        return $this->prices()->where('is_on_sale', true)->first() 
            ?? $this->prices()->orderBy('current_price', 'asc')->first();
    }

    public function isOnSale(): bool
    {
        return $this->prices()->where('is_on_sale', true)->exists();
    }

    public function isAvailableOnService(string $serviceName): bool
    {
        return $this->services()
            ->where('service_name', $serviceName)
            ->where('is_available', true)
            ->exists();
    }
}
