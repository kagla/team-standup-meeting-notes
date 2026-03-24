<?php

namespace App\Http\Controllers;

use App\Models\StandupNote;
use App\Models\TeamMember;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $now = Carbon::now();
        $weekStart = $now->copy()->startOfWeek(Carbon::MONDAY);
        $weekEnd = $now->copy()->endOfWeek(Carbon::FRIDAY);
        $totalMembers = TeamMember::count();

        // 이번 주 월~금 중 오늘까지 경과한 평일 수
        $weekdaysSoFar = 0;
        $cursor = $weekStart->copy();
        while ($cursor->lte($now) && $cursor->lte($weekEnd)) {
            if ($cursor->isWeekday()) {
                $weekdaysSoFar++;
            }
            $cursor->addDay();
        }
        $weekdaysSoFar = max($weekdaysSoFar, 1);
        $expectedNotes = $totalMembers * $weekdaysSoFar;

        $weekNotes = StandupNote::whereBetween('date', [$weekStart->toDateString(), $weekEnd->toDateString()])->get();

        // 참여율
        $participationRate = $expectedNotes > 0
            ? round($weekNotes->count() / $expectedNotes * 100)
            : 0;

        // 블로커 통계
        $allBlockers = $weekNotes->whereNotNull('blockers')->where('blockers', '!=', '');
        $resolvedBlockers = $allBlockers->where('blocker_status', 'resolved')->count();
        $totalBlockers = $allBlockers->count();
        $blockerResolutionRate = $totalBlockers > 0
            ? round($resolvedBlockers / $totalBlockers * 100)
            : 100;
        $openBlockers = $allBlockers->whereIn('blocker_status', ['open', 'in_progress'])->count();

        // 최근 7일간 일별 참여 팀원 수
        $sevenDaysAgo = $now->copy()->subDays(6)->startOfDay();
        $dailyParticipation = StandupNote::select(
                DB::raw("DATE(date) as note_date"),
                DB::raw('COUNT(DISTINCT team_member_id) as participant_count')
            )
            ->where('date', '>=', $sevenDaysAgo->toDateString())
            ->groupBy(DB::raw('DATE(date)'))
            ->pluck('participant_count', 'note_date')
            ->toArray();

        $dailyChart = [];
        $period = CarbonPeriod::create($sevenDaysAgo, $now);
        foreach ($period as $day) {
            $dateStr = $day->toDateString();
            $dailyChart[] = [
                'date' => $dateStr,
                'label' => $day->format('m/d'),
                'day' => $day->shortDayName,
                'count' => $dailyParticipation[$dateStr] ?? 0,
            ];
        }

        // 팀원별 이번 주 참여 현황
        $memberParticipation = TeamMember::select('team_members.*')
            ->withCount(['standupNotes as week_notes_count' => function ($query) use ($weekStart, $weekEnd) {
                $query->whereBetween('date', [$weekStart->toDateString(), $weekEnd->toDateString()]);
            }])
            ->orderBy('name')
            ->get()
            ->map(fn ($member) => [
                'id' => $member->id,
                'name' => $member->name,
                'role' => $member->role,
                'avatar_color' => $member->avatar_color,
                'week_notes_count' => $member->week_notes_count,
                'weekdays_so_far' => $weekdaysSoFar,
            ]);

        return Inertia::render('Dashboard', [
            'stats' => [
                'participationRate' => $participationRate,
                'blockerResolutionRate' => $blockerResolutionRate,
                'totalMembers' => $totalMembers,
                'openBlockers' => $openBlockers,
                'weekNotesCount' => $weekNotes->count(),
                'expectedNotes' => $expectedNotes,
                'weekdaysSoFar' => $weekdaysSoFar,
            ],
            'dailyChart' => $dailyChart,
            'memberParticipation' => $memberParticipation,
        ]);
    }
}
