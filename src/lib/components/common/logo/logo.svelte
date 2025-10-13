<script lang="ts">
    import logo from '$lib/public/img/logo-sq.svg';
    import logoText from '$lib/public/img/logo-text.svg';
    import { Wrench } from '@lucide/svelte';

    type Props = {
        
    }

    // let {  }
</script>

<div class="flex items-center gap-2 ml-2">
    <span class="font-bold text-2xl">Quí Sách</span>
    <div class="px-2 py-1 text-sm font-semibold bg-primary/10 text-primary rounded space-x-1"><Wrench class="inline" size={16} /><span>inDev</span></div>
</div>