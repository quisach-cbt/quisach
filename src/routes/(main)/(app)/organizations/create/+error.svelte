<script lang="ts">
    import { Head2, Head4 } from '$lib/components/ui/heading';
    import { Button } from '$lib/components/ui/button';
    import { FileQuestion, Home, Users } from '@lucide/svelte';
    import { page } from '$app/state';
</script>

<div class="flex flex-col w-full items-center justify-center min-h-[70vh] p-6 text-center">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full">
        <div class="mb-6">
            <Users size={80} class="text-primary mx-auto mb-4 animate-bounce" />
            <Head2>Access Denied</Head2>
            <div class="mt-2 text-gray-500">
                You do not have permission to create an organization.
            </div>
        </div>
        
        <div class="mb-8 p-4 bg-gray-50 rounded-md text-left">
            <Head4 class="mb-2">Error Details</Head4>
            <p class="text-sm text-gray-600">
                <span class="font-medium">Message:</span> {page.error?.message}
            </p>
        </div>
        
        <div class="space-y-4">
            <p class="text-sm text-gray-500">Here are some things you can try:</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                    variant="default" 
                    href="/organizations"
                >
                    <Users size={18} />
                    Browse Organizations
                </Button>
                <Button 
                    variant="outline" 
                    href="/home"
                >
                    <Home size={18} />
                    Return to Homepage
                </Button>
            </div>
        </div>
    </div>
</div>