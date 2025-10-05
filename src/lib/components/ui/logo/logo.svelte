<script lang="ts">
    import logo from '$lib/public/img/logo-sq.svg';
    import logoText from '$lib/public/img/logo-text.svg';
    import { Wrench } from '@lucide/svelte';

    interface Props {

    }

    // let {  }
</script>

<div class="flex items-center gap-2 ml-2">
    <img class="h-8" src={logo} alt="BTOI Logo">
    <img class="h-8" src={logoText} alt="Ben Tre Olympiad in Informatics">
    <div class="px-2 py-1 text-sm font-semibold bg-primary/10 text-primary rounded space-x-1"><Wrench class="inline" size={16} /><span>inDev</span></div>
</div>