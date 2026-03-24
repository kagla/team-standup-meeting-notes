<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamMemberController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('TeamMembers/Index', [
            'teamMembers' => TeamMember::withCount('standupNotes')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'avatar_color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        TeamMember::create($validated);

        return redirect()->route('team-members.index');
    }

    public function destroy(TeamMember $teamMember): RedirectResponse
    {
        $teamMember->delete();

        return redirect()->route('team-members.index');
    }
}
