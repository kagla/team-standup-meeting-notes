import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const AVATAR_COLORS = [
    { value: '#3B82F6', label: 'Blue' },
    { value: '#EC4899', label: 'Pink' },
    { value: '#10B981', label: 'Green' },
    { value: '#F59E0B', label: 'Amber' },
    { value: '#8B5CF6', label: 'Purple' },
];

const ROLES = ['Developer', 'Designer', 'PM', 'QA', 'DevOps'];

export default function Index({ teamMembers }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [confirmingDeletion, setConfirmingDeletion] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        role: 'Developer',
        avatar_color: AVATAR_COLORS[0].value,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('team-members.store'), {
            onSuccess: () => {
                reset();
                setShowCreateModal(false);
            },
        });
    };

    const handleDelete = (id) => {
        router.delete(route('team-members.destroy', id), {
            onSuccess: () => setConfirmingDeletion(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Team Members
                    </h2>
                    <PrimaryButton onClick={() => setShowCreateModal(true)}>
                        + Add Member
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Team Members" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {teamMembers.length === 0 ? (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-12 text-center text-gray-500">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                </svg>
                                <p className="mt-4 text-lg font-medium">No team members yet</p>
                                <p className="mt-1">Get started by adding your first team member.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {teamMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                                                    style={{ backgroundColor: member.avatar_color }}
                                                >
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {member.name}
                                                    </h3>
                                                    <span className="inline-block rounded-full bg-gray-100 px-3 py-0.5 text-sm text-gray-600">
                                                        {member.role}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setConfirmingDeletion(member.id)}
                                                className="rounded p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                                title="Delete member"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="mt-4 border-t pt-3">
                                            <p className="text-sm text-gray-500">
                                                Standup Notes: <span className="font-medium text-gray-700">{member.standup_notes_count}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="md">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Add Team Member
                    </h2>

                    <div className="mt-6">
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Enter name"
                            autoFocus
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="role" value="Role" />
                        <select
                            id="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            {ROLES.map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        <InputError message={errors.role} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel value="Avatar Color" />
                        <div className="mt-2 flex gap-3">
                            {AVATAR_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setData('avatar_color', color.value)}
                                    className={`h-10 w-10 rounded-full transition ${
                                        data.avatar_color === color.value
                                            ? 'ring-2 ring-offset-2 ring-gray-800 scale-110'
                                            : 'hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.label}
                                />
                            ))}
                        </div>
                        <InputError message={errors.avatar_color} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowCreateModal(false)}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            Add Member
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={confirmingDeletion !== null} onClose={() => setConfirmingDeletion(null)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Delete Team Member
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Are you sure you want to delete this team member? All associated standup notes will also be deleted. This action cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingDeletion(null)}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={() => handleDelete(confirmingDeletion)}>
                            Delete
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
