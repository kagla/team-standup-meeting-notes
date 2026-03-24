import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ teamMembers }) {
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        team_member_id: teamMembers.length > 0 ? teamMembers[0].id : '',
        date: today,
        yesterday: '',
        today: '',
        blockers: '',
        blocker_status: 'none',
    });

    const handleBlockersChange = (value) => {
        setData((prev) => ({
            ...prev,
            blockers: value,
            blocker_status: value.trim() ? (prev.blocker_status === 'none' ? 'open' : prev.blocker_status) : 'none',
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('standup-notes.store'));
    };

    const selectedMember = teamMembers.find((m) => m.id === Number(data.team_member_id));

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    New Standup Note
                </h2>
            }
        >
            <Head title="New Standup Note" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Team Member & Date */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <InputLabel htmlFor="team_member_id" value="Team Member" />
                                    <select
                                        id="team_member_id"
                                        value={data.team_member_id}
                                        onChange={(e) => setData('team_member_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {teamMembers.map((member) => (
                                            <option key={member.id} value={member.id}>
                                                {member.name} ({member.role})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.team_member_id} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="date" value="Date" />
                                    <TextInput
                                        id="date"
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.date} className="mt-2" />
                                </div>
                            </div>

                            {/* Preview header */}
                            {selectedMember && (
                                <div className="mt-6 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                    <div
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                                        style={{ backgroundColor: selectedMember.avatar_color }}
                                    >
                                        {selectedMember.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        Writing standup for {selectedMember.name}
                                    </span>
                                </div>
                            )}

                            {/* Yesterday */}
                            <div className="mt-6">
                                <InputLabel htmlFor="yesterday">
                                    <span className="flex items-center gap-2">
                                        <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
                                        Yesterday
                                    </span>
                                </InputLabel>
                                <textarea
                                    id="yesterday"
                                    value={data.yesterday}
                                    onChange={(e) => setData('yesterday', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="What did you accomplish yesterday?"
                                />
                                <InputError message={errors.yesterday} className="mt-2" />
                            </div>

                            {/* Today */}
                            <div className="mt-6">
                                <InputLabel htmlFor="today">
                                    <span className="flex items-center gap-2">
                                        <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                                        Today
                                    </span>
                                </InputLabel>
                                <textarea
                                    id="today"
                                    value={data.today}
                                    onChange={(e) => setData('today', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="What are you planning to do today?"
                                />
                                <InputError message={errors.today} className="mt-2" />
                            </div>

                            {/* Blockers */}
                            <div className="mt-6">
                                <InputLabel htmlFor="blockers">
                                    <span className="flex items-center gap-2">
                                        <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                                        Blockers
                                        <span className="text-xs font-normal text-gray-400">(optional)</span>
                                    </span>
                                </InputLabel>
                                <textarea
                                    id="blockers"
                                    value={data.blockers}
                                    onChange={(e) => handleBlockersChange(e.target.value)}
                                    rows={2}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Any blockers or impediments?"
                                />
                                <InputError message={errors.blockers} className="mt-2" />
                            </div>

                            {/* Blocker Status (only if blockers exist) */}
                            {data.blockers.trim() && (
                                <div className="mt-4">
                                    <InputLabel htmlFor="blocker_status" value="Blocker Status" />
                                    <select
                                        id="blocker_status"
                                        value={data.blocker_status}
                                        onChange={(e) => setData('blocker_status', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:w-auto"
                                    >
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                    <InputError message={errors.blocker_status} className="mt-2" />
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                                <Link href={route('standup-notes.index')}>
                                    <SecondaryButton type="button">Cancel</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    Submit Note
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
