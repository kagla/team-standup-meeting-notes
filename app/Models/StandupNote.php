<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StandupNote extends Model
{
    protected $fillable = [
        'team_member_id',
        'date',
        'yesterday',
        'today',
        'blockers',
        'blocker_status',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function teamMember(): BelongsTo
    {
        return $this->belongsTo(TeamMember::class);
    }
}
