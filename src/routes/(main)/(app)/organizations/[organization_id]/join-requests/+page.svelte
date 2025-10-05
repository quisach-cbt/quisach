<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Avatar } from '$lib/components/ui/avatar';
	import { CheckCircle, XCircle } from '@lucide/svelte';
	import type { PageProps } from './$types';

	function formatDate(date: string | Date): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	let { data }: PageProps = $props();
	const { joinRequests } = data;

	let formError = $state('');
	let isProcessing = $state(false);

	async function handleApproveRequest(requestId: string) {
		isProcessing = true;
		try {
			const response = await fetch(`/api/orgs/requests/approve`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					requestId
				})
			});
			
			if (!response.ok) {
				const errorData = await response.json();
				formError = errorData.message ?? 'Failed to approve request';
				return;
			}
			
			window.location.reload();
		} catch (error) {
			console.error('Error approving request:', error);
			formError = 'An error occurred while approving the request';
		} finally {
			isProcessing = false;
		}
	}

	async function handleRejectRequest(requestId: string) {
		isProcessing = true;
		try {
			const response = await fetch(`/api/orgs/requests/reject`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					requestId
				})
			});
			
			if (!response.ok) {
				const errorData = await response.json();
				formError = errorData.message ?? 'Failed to reject request';
				return;
			}
			
			window.location.reload();
		} catch (error) {
			console.error('Error rejecting request:', error);
			formError = 'An error occurred while rejecting the request';
		} finally {
			isProcessing = false;
		}
	}

	function getStatusBadge(status: string) {
		switch (status) {
			case 'ACCEPTED':
				return 'bg-green-100 text-green-800';
			case 'REJECTED':
				return 'bg-red-100 text-red-800';
			case 'PENDING':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="mt-8 overflow-x-auto pt-4">
	{#if formError}
		<div class="p-3 text-sm text-red-700 border border-red-200 rounded-md bg-red-50 mb-4">
			{formError}
		</div>
	{/if}
	
	{#if !joinRequests || joinRequests.length === 0}
		<div class="p-8 text-center text-gray-500">
			No join requests found for this organization.
		</div>
	{:else}
		<div class="inline-block min-w-full rounded-lg border border-gray-200 shadow relative z-10">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="rounded-t-lg bg-gray-100 font-bold text-gray-700">
					<tr>
						<th class="px-6 py-3 text-left text-xs text-gray-500 uppercase first:rounded-tl-lg">
							User
						</th>
						<th class="px-6 py-3 text-left text-xs text-gray-500 uppercase">
							Date Requested
						</th>
						<th class="px-6 py-3 text-left text-xs text-gray-500 uppercase last:rounded-tr-lg">
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each joinRequests as request, i}
						<tr class="transition-colors odd:bg-white even:bg-gray-50 hover:bg-gray-50 {i === joinRequests.length - 1 ? 'last-row' : ''}">
							<td class="px-6 py-4 whitespace-nowrap {i === joinRequests.length - 1 ? 'rounded-bl-lg' : ''}">
								<div class="flex items-center gap-3">
									<div class="h-10 w-10 flex-shrink-0 rounded-full">
										<Avatar
											src={request.user?.avatarUrl ?? 'https://ui-avatars.com/api/?name=' + encodeURIComponent(request.user?.displayName ?? '')}
											alt={request.user?.displayName ?? 'User'}
										/>
									</div>
									<div>
										<p class="text-sm font-medium text-gray-900">
											{request.user?.displayName ?? 'Unknown User'}
										</p>
										<p class="text-xs font-light text-gray-500">
											{request.user?.username ? '@' + request.user.username : 'no username'}
										</p>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-gray-500">
								{formatDate(request.createdAt)}
							</td>
							<td class="px-6 py-4 whitespace-nowrap {i === joinRequests.length - 1 ? 'rounded-br-lg' : ''}">
								{#if request.status === 'PENDING'}
									<div class="flex space-x-2">
										<Button 
											variant="default"
											title="Approve Request"
											onclick={() => handleApproveRequest(request.id)}
											disabled={isProcessing}
										>
											<CheckCircle class="w-4 h-4 mr-1" />
											Approve
										</Button>
										<Button
											variant="destructive"
											class="bg-red-400 text-white"
											title="Reject Request"
											onclick={() => handleRejectRequest(request.id)}
											disabled={isProcessing}
										>
											<XCircle class="w-4 h-4 mr-1" />
											Reject
										</Button>
									</div>
								{:else}
									<span class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold capitalize {getStatusBadge(request.status)}">
										{request.status.toLowerCase()}
									</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>