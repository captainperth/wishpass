<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameService extends Model
{
    protected $fillable = [
        'game_id',
        'service_name',
        'is_available',
        'tier',
        'available_until',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'available_until' => 'date',
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}
