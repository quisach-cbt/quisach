<script lang='ts'>
	import { enhance } from '$app/forms';
	import { Head2, Head4 } from "$lib/components/ui/heading/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { TextArea } from "$lib/components/ui/textarea/index.js";
	import { Upload, AlertCircle } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils.js';

	let id = $state('');
	let name = $state('');
	let description = $state('');
	let logoUrl = $state('');
	let bannerUrl = $state('');
	let logoFile: File | null = $state(null);
	let bannerFile: File | null = $state(null);
	let logoPreview = $state('');
	let bannerPreview = $state('');
	let adminUsername = $state('');
	let website = $state('');
	let isDraggingLogo = $state(false);
	let isDraggingBanner = $state(false);
	let formEl: HTMLFormElement;
	let isLoading = $state(false);

	let error = $state();

	async function handleFileUpload(event: Event, type: 'logo' | 'banner') {
		const files = (event.target as HTMLInputElement).files;
		if (!files || files.length === 0) return;
		
		const file = files[0];
		if (!file.type.startsWith('image/')) {
			error = 'Please select a valid image file';
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			error = 'Image size exceeds 5MB';
			return;
		}

		if (type === 'logo') {
			logoFile = file;
			logoUrl = URL.createObjectURL(file);
			logoPreview = URL.createObjectURL(file);
		} else {
			bannerFile = file;
			bannerUrl = URL.createObjectURL(file);
			bannerPreview = URL.createObjectURL(file);
		}
	}

	function handleDragOver(event: DragEvent, type: 'logo' | 'banner') {
		event.preventDefault();
		if (type === 'logo') {
			isDraggingLogo = true;
		} else {
			isDraggingBanner = true;
		}
	}

	function handleDragLeave(event: DragEvent, type: 'logo' | 'banner') {
		event.preventDefault();
		if (type === 'logo') {
			isDraggingLogo = false;
		} else {
			isDraggingBanner = false;
		}
	}

	function handleDrop(event: DragEvent, type: 'logo' | 'banner') {
		event.preventDefault();
		if (type === 'logo') {
			isDraggingLogo = false;
		} else {
			isDraggingBanner = false;
		}

		const files = event.dataTransfer?.files;
		if (!files || files.length === 0) return;
		
		const file = files[0];
		if (!file.type.startsWith('image/')) {
			error = 'Please select a valid image file';
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			error = 'Image size exceeds 5MB';
			return;
		}

		if (type === 'logo') {
			logoFile = file;
			logoUrl = URL.createObjectURL(file);
			logoPreview = URL.createObjectURL(file);
		} else {
			bannerFile = file;
			bannerUrl = URL.createObjectURL(file);
			bannerPreview = URL.createObjectURL(file);
		}
	}

	async function handleSubmit() {
		isLoading = true;

		const formData = new FormData();
		formData.append('id', id);
		formData.append('name', name);
		formData.append('description', description);
		if (logoFile) formData.append('logoFile', logoFile);
		if (bannerFile) formData.append('bannerFile', bannerFile);
		formData.append('adminUsername', adminUsername);
		formData.append('website', website);

		const response = await fetch(`/api/orgs/create`, {
			method: 'POST',
			body: formData
		});
		const data = await response.json();
		if (data.status !== 200) {
			error = data.message;
		} else {
			goto(`/organizations/${data.organization.id}`);
		}
		isLoading = false;
	}
</script>

<svelte:head>
	<title>Create Organization | BTOI: Ben Tre Olympiad in Informatics</title>
</svelte:head>

<div class='container max-w-3xl mx-auto py-8 px-4'>
	<div class="bg-white rounded-lg shadow-md p-8 mb-8">
		<Head2 class="mb-6 text-center">Create New Organization</Head2>

		{#if error}
			<div class='flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm'>
				<AlertCircle size={16} />
				<span>{error}</span>
			</div>
		{/if}
		
		<form method='POST' enctype="multipart/form-data" use:enhance bind:this={formEl} class='space-y-6'>
			<div class="border-b border-gray-200 pb-6">
				<Head4>Basic Information</Head4>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
						<label class='text-sm text-gray-700 space-y-1'>
							<div class='font-medium text-gray-700'>Organization ID</div>
							<Input
								class="font-body"
								name='id'
								type='text'
								bind:value={id}
								placeholder='Enter organization ID'
							/>
							<p class="mt-1 text-xs font-body text-gray-500">Must be unique, used in URLs</p>
						</label>

						<label class='text-sm text-gray-700 space-y-1'>
							<div class='font-medium text-gray-700'>Name</div>
							<Input
								class='font-body'
								name='name'
								type='text'
								bind:value={name}
								placeholder='Enter organization name'
							/>
						</label>
				</div>

				<div class="mt-5">
					<label for='description' class='block text-sm font-medium text-gray-700 mb-1'>Description</label>
					<TextArea
						name='description'
						bind:value={description}
						placeholder='Enter organization description'
						rows={3}
					/>
				</div>
			</div>

			<div class="border-b border-gray-200 pb-6">
				<Head4>Branding</Head4>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label for='logoUrl' class='block text-sm font-medium text-gray-700 mb-1'>Logo</label>
						<input name='logoUrl' type='hidden' bind:value={logoUrl} />
						<div 
							class={'relative border-2 border-dashed rounded-md flex flex-col items-center justify-center h-40 transition-colors overflow-hidden ' + 
								(isDraggingLogo ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50')}
							aria-label='Drag and drop logo here or click to upload'
							role='button'
							tabindex="0"
							ondragover={(e) => handleDragOver(e, 'logo')} 
							ondragleave={(e) => handleDragLeave(e, 'logo')} 
							ondrop={(e) => handleDrop(e, 'logo')}
						>
							{#if logoPreview}
								<img 
									src={logoPreview} 
									alt="Logo preview" 
									class="h-full max-h-28 object-contain" 
								/>
								<div class="absolute inset-0 bg-black/0 hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
									<button 
										type="button" 
										class="text-white text-sm font-medium" 
										onclick={() => {
											logoFile = null;
											logoUrl = '';
											logoPreview = '';
										}}
									>
										Replace Image
									</button>
								</div>
							{:else}
								<div class="p-6 flex flex-col items-center">
									<div class="bg-primary/10 p-3 rounded-full mb-3">
										<Upload size={20} class="text-primary" />
									</div>
									<p class="text-sm text-gray-500 text-center mb-2">Drag and drop your logo here or</p>
									<div class="relative">
										<Button 
											type="button" 
											variant="outline" 
											size="sm"
											class="border-primary text-primary hover:bg-primary/10"
										>
											Browse files
										</Button>
										<input 
											name='logoFile'
											type="file" 
											accept="image/*" 
											class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
											onchange={(e) => handleFileUpload(e, 'logo')}
										/>
									</div>
									<p class="text-xs text-gray-400 mt-2">PNG, JPG, WEBP up to 5MB</p>
								</div>
							{/if}
						</div>
						<p class="mt-1 text-xs text-gray-500">Recommended size: 512x512px</p>
					</div>

					<div>
						<label for='bannerUrl' class='block text-sm font-medium text-gray-700 mb-1'>Banner</label>
						<input name='bannerUrl' type='hidden' bind:value={bannerUrl} />
						<div 
							class={cn('relative border-2 border-dashed rounded-md flex flex-col items-center justify-center h-40 transition-colors overflow-hidden', isDraggingBanner && 'border-primary bg-primary/5', !isDraggingBanner && 'border-gray-300 hover:border-primary hover:bg-gray-50')}
							aria-label='Drag and drop banner here or click to upload'
							role='button'
							tabindex="0"
							ondragover={(e) => handleDragOver(e, 'banner')} 
							ondragleave={(e) => handleDragLeave(e, 'banner')} 
							ondrop={(e) => handleDrop(e, 'banner')}
						>
							{#if bannerPreview}
								<img 
									src={bannerPreview} 
									alt="Banner preview" 
									class="h-full w-full object-cover" 
								/>
								<div class="absolute inset-0 bg-black/0 hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
									<button 
										type="button" 
										class="text-white text-sm font-medium" 
										onclick={() => {
											bannerFile = null;
											bannerUrl = '';
											bannerPreview = '';
										}}
									>
										Replace Image
									</button>
								</div>
							{:else}
								<div class="p-6 flex flex-col items-center">
									<div class="bg-primary/10 p-3 rounded-full mb-3">
										<Upload size={20} class="text-primary" />
									</div>
									<p class="text-sm text-gray-500 text-center mb-2">Drag and drop your banner here or</p>
									<div class="relative">
										<Button 
											type="button" 
											variant="outline" 
											size="sm"
											class="border-primary text-primary hover:bg-primary/10"
										>
											Browse files
										</Button>
										<input 
											name='bannerFile'
											type="file" 
											accept="image/*" 
											class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
											onchange={(e) => handleFileUpload(e, 'banner')}
										/>
									</div>
									<p class="text-xs text-gray-400 mt-2">PNG, JPG, WEBP up to 5MB</p>
								</div>
							{/if}
						</div>
						<p class="mt-1 text-xs text-gray-500">Recommended size: 1200x400px</p>
					</div>
				</div>
			</div>

			<div class="pb-6">
				<Head4>Administration & Contact</Head4>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label for='adminUsername' class='block text-sm font-medium text-gray-700 mb-1'>Admin Username</label>
						<Input
							name='adminUsername'
							type='text'
							bind:value={adminUsername}
							placeholder='Enter admin username'
						/>
						<p class="mt-1 text-xs text-gray-500">This user will be the organization admin</p>
					</div>

					<div>
						<label for='website' class='block text-sm font-medium text-gray-700 mb-1'>Website (Optional)</label>
						<Input
							name='website'
							type='url'
							bind:value={website}
							placeholder='https://example.com'
						/>
					</div>
				</div>
			</div>

			<div class="pt-4 flex justify-end gap-3">
				<Button
					variant='outline'
					type='button'
					onclick={() => history.back()}
				>
					Cancel
				</Button>
				<Button
					onclick={() => handleSubmit()}
					disabled={isLoading}
				>
					Create Organization
				</Button>
			</div>
		</form>
	</div>
</div>