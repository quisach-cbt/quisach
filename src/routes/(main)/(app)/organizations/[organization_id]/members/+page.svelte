<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Avatar } from '$lib/components/ui/avatar';
	import type { PageProps } from './$types';
	import { Trash2, UserCog } from '@lucide/svelte';
	import { Head4 } from '$lib/components/ui/heading';
	import { Modal } from '$lib/components/ui/modal';
	import { Select } from '$lib/components/ui/select';

	let { data }: PageProps = $props();
	const { organizationMember, currentUserLoadMember } = data;

	let formError = $state('');
	let changeRoleOpen = $state(false);
	let selectRole = $state('');

	const roles = [
		{ value: 'ADMIN', label: 'Admin' },
		{ value: 'STAFF', label: 'Staff' },
		{ value: 'MEMBER', label: 'Member' }
	]

	const adminMembers = organizationMember?.filter(member => member.role === 'ADMIN') || [];
	const regularMembers = organizationMember?.filter(member => member.role !== 'ADMIN') || [];

	adminMembers.sort((a, b) => {
		return (a.user?.displayName || '').localeCompare(b.user?.displayName || '');
	});
	
	regularMembers.sort((a, b) => {
		return (a.user?.displayName || '').localeCompare(b.user?.displayName || '');
	});

	async function handleChangeRole(memberId: string, memberRole: string) {
		const role = memberRole === 'ADMIN' ? 'MEMBER' : 'ADMIN';
		const response = await fetch(`/api/orgs/changeRole/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				memberId,
				role
			})
		});
		if (response.status === 200) {
			window.location.reload();
			console.log(`Changed role of member with ID: ${memberId} to ${role}`);
		} else {
			console.error(`Failed to change role of member with ID: ${memberId}`);
		}
	}

	async function handleRemoveMember(memberId: string) {
		const response = await fetch(`/api/orgs/removeMember`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: memberId
			})
		})
		if (response.status === 200) {
			window.location.reload();
			console.log(`Removed member with ID: ${memberId}`);
		} else {
			const errorData = await response.json();
			formError = errorData.message ?? 'Failed to remove member';
			return;
		}
	}
</script>

<div class="mt-8 flex flex-col gap-6">
	{#if formError}
		<div class="p-3 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
			{formError}
		</div>
	{/if}

	<div>
		<Head4 class="mb-4">Administrators & Staff</Head4>
		<div class="inline-block min-w-full rounded-lg border border-gray-200 shadow">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="rounded-t-lg bg-gray-100 font-bold text-gray-700">
					<tr>
						<th class="px-6 py-3 text-left text-xs text-gray-500 uppercase first:rounded-tl-lg">User</th>
						<th class="px-6 py-3 text-left text-xs text-gray-500 uppercase">Role</th>
						<th class="px-6 py-3 text-left text-xs text-gray-500 uppercase">Points</th>
						{#if currentUserLoadMember.role === 'ADMIN'}
						<th class="px-6 py-3 text-left text-xs text-gray-500 uppercase last:rounded-tr-lg">Actions</th>
						{:else}
						<th class="px-6 py-3 text-left text-xs text-gray-500 uppercase last:rounded-tr-lg"></th>
						{/if}
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each adminMembers as member, i}
						<tr class="transition-colors odd:bg-white even:bg-gray-50 hover:bg-gray-50 bg-blue-50 font-semibold {i === adminMembers.length - 1 ? 'last-row' : ''}">
							<td class="px-6 py-4 whitespace-nowrap {i === adminMembers.length - 1 ? 'rounded-bl-lg' : ''}">
								<div class="flex items-center gap-3">
									<div class="h-10 w-10 flex-shrink-0 rounded-full">
										<Avatar
											src={member.user?.avatarUrl ?? 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.user?.displayName ?? '')}
											alt={member.user?.displayName ?? 'User'}
										/>
									</div>
									<div>
										<p class="text-sm font-medium text-gray-900">
											{member.user?.displayName ?? 'Unknown User'}
										</p>
										<p class="text-xs font-light text-gray-500">
											{member.user?.username ? '@' + member.user.username : 'no username'}
										</p>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800 capitalize">
									{member.role}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-gray-500">0</td>
							{#if currentUserLoadMember.role === 'ADMIN'}
							<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap {i === adminMembers.length - 1 ? 'rounded-br-lg' : ''}">
								<div class="flex space-x-2">
									<Button 
										variant="default"
										title="Change to Member"
										onclick={() => handleChangeRole(member.id, member.role)}
									>
										<UserCog class="w-4 h-4 mr-1" />
									</Button>
									<Button
										variant="destructive"
										class="bg-red-400 text-white"
										title="Remove"
										onclick={() => handleRemoveMember(member.id)}
									>
										<Trash2 class="w-4 h-4 mr-1" />
									</Button>
								</div>
							</td>
							{:else}
							<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap {i === adminMembers.length - 1 ? 'rounded-br-lg' : ''}"></td>
							{/if}
						</tr>
					{:else}
						<tr>
							<td colspan={currentUserLoadMember.role === 'ADMIN' ? 4 : 3} class="px-6 py-4 text-center text-gray-500">No administrators found</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<div>
		<Head4 class="mb-4">Members</Head4>
		<div class="inline-block min-w-full rounded-lg border border-gray-200 shadow">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="rounded-t-lg bg-gray-100 font-bold text-gray-700">
					<tr>
						<th class="px-6 py-3 text-left text-xs text-gray-500 uppercase first:rounded-tl-lg">User</th>
						<th class="px-6 py-3 text-left text-xs text-gray-500 uppercase">Points</th>
						{#if currentUserLoadMember.role === 'ADMIN'}
						<th class="px-6 py-3 text-left text-xs text-gray-500 uppercase last:rounded-tr-lg">Actions</th>
						{:else}
						<th class="px-6 py-3 text-left text-xs text-gray-500 uppercase last:rounded-tr-lg"></th>
						{/if}
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each regularMembers as member, i}
						<tr class="transition-colors odd:bg-white even:bg-gray-50 hover:bg-gray-50 {i === regularMembers.length - 1 ? 'last-row' : ''}">
							<td class="px-6 py-4 whitespace-nowrap {i === regularMembers.length - 1 ? 'rounded-bl-lg' : ''}">
								<div class="flex items-center gap-3">
									<div class="h-10 w-10 flex-shrink-0 rounded-full">
										<Avatar
											src={member.user?.avatarUrl ?? 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.user?.displayName ?? '')}
											alt={member.user?.displayName ?? 'User'}
										/>
									</div>
									<div>
										<p class="text-sm font-medium text-gray-900">
											{member.user?.displayName ?? 'Unknown User'}
										</p>
										<p class="text-xs font-light text-gray-500">
											{member.user?.username ? '@' + member.user.username : 'no username'}
										</p>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-gray-500">0</td>
							{#if currentUserLoadMember.role === 'ADMIN'}
							<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap {i === regularMembers.length - 1 ? 'rounded-br-lg' : ''}">
								<div class="flex space-x-2">
									<Button 
										variant="default"
										title="Change to Admin"
										onclick={() => handleChangeRole(member.id, member.role)}
									>
										<UserCog class="w-4 h-4 mr-1" />
									</Button>
									<Button
										variant="destructive"
										class="bg-red-400 text-white"
										title="Remove"
										onclick={() => handleRemoveMember(member.id)}
									>
										<Trash2 class="w-4 h-4 mr-1" />
									</Button>
								</div>
							</td>
							{:else}
							<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap {i === regularMembers.length - 1 ? 'rounded-br-lg' : ''}"></td>
							{/if}
						</tr>
					{:else}
						<tr>
							<td colspan={currentUserLoadMember.role === 'ADMIN' ? 4 : 3} class="px-6 py-4 text-center text-gray-500">No regular members found</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<Modal
	size='md'
	bind:isOpen={changeRoleOpen}
	title='Change member role'
>
{#snippet children()}
	<p class="text-sm text-gray-600">
		Select a new role for the member. The member will be notified of the change.
	</p>

	<div class="space-y-2">
		<label for="expiration" class="block text-sm font-medium text-gray-700">Role</label>
		<Select 
			value={selectRole}
			options={roles}
			placeholder="Select expiration time"
			onChange={(value) => selectRole = value}
		/>
	</div>
{/snippet}
</Modal>