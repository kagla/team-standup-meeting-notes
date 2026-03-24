<?php

namespace App\Http\Controllers;

use App\Models\StandupNote;
use App\Models\TeamMember;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StandupNoteController extends Controller
{
    public function index(Request $request): Response
    {
        $date = $request->query('date', now()->toDateString());
        $teamMemberId = $request->query('team_member_id');

        $query = StandupNote::with('teamMember')
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc');

        if ($date) {
            $query->whereDate('date', $date);
        }

        if ($teamMemberId) {
            $query->where('team_member_id', $teamMemberId);
        }

        return Inertia::render('StandupNotes/Index', [
            'standupNotes' => $query->get(),
            'teamMembers' => TeamMember::orderBy('name')->get(),
            'filters' => [
                'date' => $date,
                'team_member_id' => $teamMemberId,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('StandupNotes/Create', [
            'teamMembers' => TeamMember::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'team_member_id' => 'required|exists:team_members,id',
            'date' => 'required|date',
            'yesterday' => 'required|string',
            'today' => 'required|string',
            'blockers' => 'nullable|string',
            'blocker_status' => 'required|in:none,open,in_progress,resolved',
        ]);

        StandupNote::create($validated);

        return redirect()->route('standup-notes.index', ['date' => $validated['date']]);
    }

    public function calendar(Request $request): Response
    {
        $year = (int) $request->query('year', now()->year);
        $month = (int) $request->query('month', now()->month);

        $startOfMonth = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();

        // 날짜별 노트 수 + 팀원 수
        $notesByDate = StandupNote::with('teamMember')
            ->whereBetween('date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->get()
            ->groupBy(fn ($note) => $note->date->toDateString());

        $totalMembers = TeamMember::count();

        $calendarData = [];
        foreach ($notesByDate as $date => $notes) {
            $calendarData[$date] = [
                'count' => $notes->count(),
                'total' => $totalMembers,
                'notes' => $notes->map(fn ($n) => [
                    'id' => $n->id,
                    'yesterday' => $n->yesterday,
                    'today' => $n->today,
                    'blockers' => $n->blockers,
                    'blocker_status' => $n->blocker_status,
                    'team_member' => [
                        'id' => $n->teamMember->id,
                        'name' => $n->teamMember->name,
                        'role' => $n->teamMember->role,
                        'avatar_color' => $n->teamMember->avatar_color,
                    ],
                ])->values(),
            ];
        }

        return Inertia::render('StandupNotes/Calendar', [
            'calendarData' => $calendarData,
            'year' => $year,
            'month' => $month,
            'totalMembers' => $totalMembers,
        ]);
    }

    public function history(Request $request): Response
    {
        $teamMemberId = $request->query('team_member_id');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $blockerStatus = $request->query('blocker_status');

        $query = StandupNote::with('teamMember')
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc');

        if ($teamMemberId) {
            $query->where('team_member_id', $teamMemberId);
        }

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        if ($blockerStatus && $blockerStatus !== 'all') {
            if ($blockerStatus === 'has_blocker') {
                $query->whereNotNull('blockers')->where('blockers', '!=', '');
            } else {
                $query->where('blocker_status', $blockerStatus);
            }
        }

        return Inertia::render('StandupNotes/History', [
            'standupNotes' => $query->paginate(10)->withQueryString(),
            'teamMembers' => TeamMember::orderBy('name')->get(),
            'filters' => [
                'team_member_id' => $teamMemberId,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'blocker_status' => $blockerStatus,
            ],
        ]);
    }

    public function update(Request $request, StandupNote $standupNote): RedirectResponse
    {
        $validated = $request->validate([
            'blocker_status' => 'required|in:none,open,in_progress,resolved',
        ]);

        $standupNote->update($validated);

        return redirect()->back();
    }
}
