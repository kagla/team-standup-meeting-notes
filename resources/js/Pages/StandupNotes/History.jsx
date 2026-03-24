import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const BLOCKER_STATUS_CONFIG = {
    none: { label: 'None', className: 'bg-gray-100 text-gray-600' },
    open: { label: 'Open', className: 'bg-red-100 text-red-700' },
    in_progress: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700' },
    resolved: { label: 'Resolved', className: 'bg-green-100 text-green-700' },
};

const FILTER_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'has_blocker', label: 'Has Blocker' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
];

function Pagination({ links }) {
    if (links.length <= 3) return null;

    return (
        <nav className="flex items-center justify-center gap-1">
            {links.map((link, i) => {
                if (!link.url) {
                    return (
                        <span
                            key={i}
                            className="rounded-md px-3 py-2 text-sm text-gray-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={i}
                        href={link.url}
                        className={`rounded-md px-3 py-2 text-sm transition ${
                            link.active
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        preserveState
                    />
                );
            })}
        </nav>
    );
}

function NoteCard({ note }) {
    const member = note.team_member;

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
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
                <div className="flex items-center gap-3">
                    {note.blockers && (
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${BLOCKER_STATUS_CONFIG[note.blocker_status]?.className}`}>
                            {BLOCKER_STATUS_CONFIG[note.blocker_status]?.label}
                        </span>
                    )}
                    <time className="text-sm font-medium text-gray-500">{note.date}</time>
                </div>
            </div>

            {/* Content */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            </div>
            {note.blockers && (
                <div className="mt-3 rounded-md bg-red-50 p-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-red-700">
                        <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                        Blockers
                    </h4>
                    <p className="mt-1 whitespace-pre-line text-sm text-red-600">{note.blockers}</p>
                </div>
            )}
        </div>
    );
}

export default function History({ standupNotes, teamMembers, filters }) {
    const [localFilters, setLocalFilters] = useState({
        team_member_id: filters.team_member_id || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        blocker_status: filters.blocker_status || '',
    });

    const applyFilters = () => {
        const params = {};
        if (localFilters.team_member_id) params.team_member_id = localFilters.team_member_id;
        if (localFilters.start_date) params.start_date = localFilters.start_date;
        if (localFilters.end_date) params.end_date = localFilters.end_date;
        if (localFilters.blocker_status) params.blocker_status = localFilters.blocker_status;

        router.get(route('standup-notes.history'), params, { preserveState: true });
    };

    const clearFilters = () => {
        setLocalFilters({ team_member_id: '', start_date: '', end_date: '', blocker_status: '' });
        router.get(route('standup-notes.history'), {}, { preserveState: true });
    };

    const hasActiveFilters = Object.values(localFilters).some(Boolean);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    History
                </h2>
            }
        >
            <Head title="History" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex flex-wrap items-end gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500">Member</label>
                                <select
                                    value={localFilters.team_member_id}
                                    onChange={(e) => setLocalFilters({ ...localFilters, team_member_id: e.target.value })}
                                    className="mt-1 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All Members</option>
                                    {teamMembers.map((m) => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500">From</label>
                                <input
                                    type="date"
                                    value={localFilters.start_date}
                                    onChange={(e) => setLocalFilters({ ...localFilters, start_date: e.target.value })}
                                    className="mt-1 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500">To</label>
                                <input
                                    type="date"
                                    value={localFilters.end_date}
                                    onChange={(e) => setLocalFilters({ ...localFilters, end_date: e.target.value })}
                                    className="mt-1 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500">Blocker Status</label>
                                <select
                                    value={localFilters.blocker_status}
                                    onChange={(e) => setLocalFilters({ ...localFilters, blocker_status: e.target.value })}
                                    className="mt-1 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {FILTER_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={applyFilters}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                                >
                                    Filter
                                </button>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="ml-auto text-sm text-gray-500">
                                {standupNotes.total} note{standupNotes.total !== 1 && 's'}
                            </div>
                        </div>
                    </div>

                    {/* Notes list */}
                    {standupNotes.data.length === 0 ? (
                        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                            <p className="mt-4 text-lg font-medium text-gray-900">No notes found</p>
                            <p className="mt-1 text-gray-500">Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {standupNotes.data.map((note) => (
                                <NoteCard key={note.id} note={note} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-6">
                        <Pagination links={standupNotes.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
