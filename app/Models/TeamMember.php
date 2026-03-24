<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TeamMember extends Model
{
    protected $fillable = [
        'name',
        'role',
        'avatar_color',
    ];

    public function standupNotes(): HasMany
    {
        return $this->hasMany(StandupNote::class);
    }
}
