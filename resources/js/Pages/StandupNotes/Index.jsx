import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router } from '@inertiajs/react';

const BLOCKER_STATUS_CONFIG = {
    none: { label: 'None', className: 'bg-gray-100 text-gray-600' },
    open: { label: 'Open', className: 'bg-red-100 text-red-700' },
    in_progress: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700' },
    resolved: { label: 'Resolved', className: 'bg-green-100 text-green-700' },
};

const BLOCKER_STATUSES = ['none', 'open', 'in_progress', 'resolved'];

function BlockerStatusBadge({ status, noteId, hasBlockers }) {
    if (!hasBlockers) return null;

    const config = BLOCKER_STATUS_CONFIG[status] || BLOCKER_STATUS_CONFIG.none;

    const handleChange = (e) => {
        router.patch(
            route('standup-notes.update-status', noteId),
            { blocker_status: e.target.value },
            { preserveScroll: true },
        );
    };

    return (
        <select
            value={status}
            onChange={handleChange}
            className={`rounded-full border-0 px-3 py-0.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500 ${config.className}`}
        >
            {BLOCKER_STATUSES.map((s) => (
                <option key={s} value={s}>
                    {BLOCKER_STATUS_CONFIG[s].label}
                </option>
            ))}
        </select>
    );
}

function NoteCard({ note }) {
    const member = note.team_member;

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                            style={{ backgroundColor: member.avatar_color }}
                        >
                            {member.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <span className="text-sm text-gray-500">{member.role}</span>
                        </div>
                    </div>
                    <BlockerStatusBadge
                        status={note.blocker_status}
                        noteId={note.id}
                        hasBlockers={!!note.blockers}
                    />
                </div>

                {/* Content */}
                <div className="mt-5 space-y-4">
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
                            Yesterday
                        </h4>
                        <p className="mt-1 whitespace-pre-line text-sm text-gray-600">{note.yesterday}</p>
                    </div>
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                            Today
                        </h4>
                        <p className="mt-1 whitespace-pre-line text-sm text-gray-600">{note.today}</p>
                    </div>
                    {note.blockers && (
                        <div className="rounded-md bg-red-50 p-3">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-red-700">
                                <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                                Blockers
                            </h4>
                            <p className="mt-1 whitespace-pre-line text-sm text-red-600">{note.blockers}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Index({ standupNotes, teamMembers, filters }) {
    const handleDateChange = (e) => {
        router.get(
            route('standup-notes.index'),
            { date: e.target.value, team_member_id: filters.team_member_id },
            { preserveState: true },
        );
    };

    const handleMemberFilter = (e) => {
        const value = e.target.value;
        router.get(
            route('standup-notes.index'),
            { date: filters.date, team_member_id: value || undefined },
            { preserveState: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Standup Notes
                    </h2>
                    <Link href={route('standup-notes.create')}>
                        <PrimaryButton>+ New Note</PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="Standup Notes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2">
                            <label htmlFor="date" className="text-sm font-medium text-gray-700">
                                Date
                            </label>
                            <input
                                id="date"
                                type="date"
                                value={filters.date}
                                onChange={handleDateChange}
                                className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="member" className="text-sm font-medium text-gray-700">
                                Member
                            </label>
                            <select
                                id="member"
                                value={filters.team_member_id || ''}
                                onChange={handleMemberFilter}
                                className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">All Members</option>
                                {teamMembers.map((m) => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="ml-auto text-sm text-gray-500">
                            {standupNotes.length} note{standupNotes.length !== 1 && 's'}
                        </div>
                    </div>

                    {/* Notes Grid */}
                    {standupNotes.length === 0 ? (
                        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            <p className="mt-4 text-lg font-medium text-gray-900">No standup notes</p>
                            <p className="mt-1 text-gray-500">No notes found for this date. Create one to get started.</p>
                            <div className="mt-6">
                                <Link href={route('standup-notes.create')}>
                                    <PrimaryButton>+ New Note</PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {standupNotes.map((note) => (
                                <NoteCard key={note.id} note={note} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
