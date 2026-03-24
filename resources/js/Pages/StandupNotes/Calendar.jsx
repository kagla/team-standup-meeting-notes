import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const BLOCKER_STATUS_CONFIG = {
    none: { label: 'None', className: 'bg-gray-100 text-gray-600' },
    open: { label: 'Open', className: 'bg-red-100 text-red-700' },
    in_progress: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700' },
    resolved: { label: 'Resolved', className: 'bg-green-100 text-green-700' },
};

function buildCalendarGrid(year, month) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDow = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const cells = [];

    // Leading empty cells
    for (let i = 0; i < startDow; i++) {
        cells.push({ day: null, date: null });
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        cells.push({ day: d, date: dateStr });
    }

    // Trailing empty cells
    while (cells.length % 7 !== 0) {
        cells.push({ day: null, date: null });
    }

    return cells;
}

function getMonthName(month) {
    return new Date(2000, month - 1).toLocaleString('en-US', { month: 'long' });
}

function DayNoteModal({ date, notes, onClose }) {
    if (!notes) return null;

    return (
        <Modal show={!!date} onClose={onClose} maxWidth="lg">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">{date}</h2>
                <p className="mt-1 text-sm text-gray-500">{notes.length} note{notes.length !== 1 && 's'}</p>

                <div className="mt-4 max-h-96 space-y-4 overflow-y-auto">
                    {notes.map((note) => (
                        <div key={note.id} className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                        style={{ backgroundColor: note.team_member.avatar_color }}
                                    >
                                        {note.team_member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900">{note.team_member.name}</span>
                                        <span className="ml-2 text-sm text-gray-500">{note.team_member.role}</span>
                                    </div>
                                </div>
                                {note.blockers && (
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${BLOCKER_STATUS_CONFIG[note.blocker_status]?.className}`}>
                                        {BLOCKER_STATUS_CONFIG[note.blocker_status]?.label}
                                    </span>
                                )}
                            </div>
                            <div className="mt-3 space-y-2 text-sm">
                                <div>
                                    <span className="font-medium text-blue-600">Yesterday:</span>
                                    <p className="mt-0.5 whitespace-pre-line text-gray-600">{note.yesterday}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-green-600">Today:</span>
                                    <p className="mt-0.5 whitespace-pre-line text-gray-600">{note.today}</p>
                                </div>
                                {note.blockers && (
                                    <div className="rounded bg-red-50 p-2">
                                        <span className="font-medium text-red-600">Blockers:</span>
                                        <p className="mt-0.5 whitespace-pre-line text-red-600">{note.blockers}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default function Calendar({ calendarData, year, month, totalMembers }) {
    const [selectedDate, setSelectedDate] = useState(null);

    const cells = buildCalendarGrid(year, month);
    const today = new Date().toISOString().split('T')[0];

    const navigate = (offset) => {
        let newMonth = month + offset;
        let newYear = year;
        if (newMonth < 1) { newMonth = 12; newYear--; }
        if (newMonth > 12) { newMonth = 1; newYear++; }
        router.get(route('standup-notes.calendar'), { year: newYear, month: newMonth }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Calendar
                </h2>
            }
        >
            <Head title="Calendar" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        {/* Month navigation */}
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {getMonthName(month)} {year}
                            </h3>
                            <button
                                onClick={() => navigate(1)}
                                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 border-b px-6 py-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                                Full
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500" />
                                Partial
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gray-200" />
                                None
                            </span>
                        </div>

                        {/* Calendar grid */}
                        <div className="p-4">
                            {/* Day headers */}
                            <div className="grid grid-cols-7 gap-1">
                                {DAYS_OF_WEEK.map((day) => (
                                    <div key={day} className="py-2 text-center text-xs font-semibold uppercase text-gray-500">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Day cells */}
                            <div className="grid grid-cols-7 gap-1">
                                {cells.map((cell, i) => {
                                    if (!cell.day) {
                                        return <div key={i} className="aspect-square" />;
                                    }

                                    const data = calendarData[cell.date];
                                    const hasNotes = data && data.count > 0;
                                    const isFullParticipation = hasNotes && data.count >= totalMembers;
                                    const isToday = cell.date === today;
                                    const isWeekend = i % 7 === 0 || i % 7 === 6;

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => hasNotes && setSelectedDate(cell.date)}
                                            disabled={!hasNotes}
                                            className={`relative flex aspect-square flex-col items-center justify-center rounded-lg border transition
                                                ${isToday ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-transparent'}
                                                ${hasNotes ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'}
                                                ${isWeekend ? 'bg-gray-50/50' : ''}
                                            `}
                                        >
                                            <span className={`text-sm ${isToday ? 'font-bold text-indigo-600' : isWeekend ? 'text-gray-400' : 'text-gray-700'}`}>
                                                {cell.day}
                                            </span>
                                            {hasNotes && (
                                                <div className="mt-1 flex items-center gap-1">
                                                    <span
                                                        className={`inline-block h-2 w-2 rounded-full ${isFullParticipation ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                    />
                                                    <span className="text-[10px] text-gray-500">
                                                        {data.count}/{totalMembers}
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Note detail modal */}
            <DayNoteModal
                date={selectedDate}
                notes={selectedDate ? calendarData[selectedDate]?.notes : null}
                onClose={() => setSelectedDate(null)}
            />
        </AuthenticatedLayout>
    );
}
