<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GamePrice extends Model
{
    protected $fillable = [
        'game_id',
        'store',
        'current_price',
        'original_price',
        'discount_percent',
        'is_on_sale',
        'sale_end_date',
        'store_url',
        'currency',
    ];

    protected $casts = [
        'current_price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'discount_percent' => 'integer',
        'is_on_sale' => 'boolean',
        'sale_end_date' => 'datetime',
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}
