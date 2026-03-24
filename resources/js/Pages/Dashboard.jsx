import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

function KpiCard({ title, value, subtitle, color }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        red: 'bg-red-50 text-red-600',
    };

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="p-6">
                <div className="text-sm font-medium text-gray-500">{title}</div>
                <div className="mt-2 flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${colorClasses[color]?.split(' ')[1] || 'text-gray-900'}`}>
                        {value}
                    </span>
                </div>
                {subtitle && (
                    <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                )}
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    return (
        <div className="rounded-lg border bg-white px-3 py-2 shadow-lg">
            <p className="text-sm font-medium text-gray-900">
                {data.label} ({data.day})
            </p>
            <p className="text-sm text-gray-600">
                {data.count} member{data.count !== 1 && 's'}
            </p>
        </div>
    );
}

function DailyChart({ data, totalMembers }) {
    return (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="p-6">
                <h3 className="text-base font-semibold text-gray-900">
                    Daily Participation (Last 7 Days)
                </h3>
                <div className="mt-4 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                tickLine={false}
                                axisLine={{ stroke: '#e5e7eb' }}
                            />
                            <YAxis
                                allowDecimals={false}
                                domain={[0, Math.max(totalMembers, 1)]}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
                                {data.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={entry.count >= totalMembers ? '#10b981' : entry.count > 0 ? '#3b82f6' : '#e5e7eb'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                        Full participation
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
            </div>
        </div>
    );
}

function MemberTable({ members }) {
    return (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="p-6">
                <h3 className="text-base font-semibold text-gray-900">
                    This Week&apos;s Participation
                </h3>
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b text-xs uppercase text-gray-500">
                                <th className="pb-3 font-medium">Member</th>
                                <th className="pb-3 font-medium">Role</th>
                                <th className="pb-3 text-center font-medium">Notes</th>
                                <th className="pb-3 font-medium">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {members.map((member) => {
                                const pct = member.weekdays_so_far > 0
                                    ? Math.round((member.week_notes_count / member.weekdays_so_far) * 100)
                                    : 0;
                                return (
                                    <tr key={member.id}>
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                                    style={{ backgroundColor: member.avatar_color }}
                                                >
                                                    {member.name.charAt(0)}
                                                </div>
                                                <span className="whitespace-nowrap font-medium text-gray-900">{member.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-gray-500">{member.role}</td>
                                        <td className="py-3 text-center">
                                            <span className="font-medium text-gray-900">{member.week_notes_count}</span>
                                            <span className="text-gray-400"> / {member.weekdays_so_far}</span>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${
                                                            pct >= 100
                                                                ? 'bg-emerald-500'
                                                                : pct >= 50
                                                                  ? 'bg-blue-500'
                                                                  : 'bg-amber-500'
                                                        }`}
                                                        style={{ width: `${Math.min(pct, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="w-10 text-xs text-gray-500">{pct}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard({ stats, dailyChart, memberParticipation }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <KpiCard
                            title="Participation Rate"
                            value={`${stats.participationRate}%`}
                            subtitle={`${stats.weekNotesCount} / ${stats.expectedNotes} notes this week`}
                            color="blue"
                        />
                        <KpiCard
                            title="Blocker Resolution"
                            value={`${stats.blockerResolutionRate}%`}
                            subtitle="Resolved vs total blockers"
                            color="green"
                        />
                        <KpiCard
                            title="Team Members"
                            value={stats.totalMembers}
                            subtitle="Active team members"
                            color="indigo"
                        />
                        <KpiCard
                            title="Open Blockers"
                            value={stats.openBlockers}
                            subtitle="Requires attention"
                            color={stats.openBlockers > 0 ? 'red' : 'green'}
                        />
                    </div>

                    {/* Chart & Table */}
                    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div>
                            <DailyChart data={dailyChart} totalMembers={stats.totalMembers} />
                        </div>
                        <div>
                            <MemberTable members={memberParticipation} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
