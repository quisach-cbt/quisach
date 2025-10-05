<script lang="ts">
  interface TabItem {
    label: string;
    href: string;
  }

  interface Props {
    tabs: TabItem[];
    active?: number;
    classname?: string;
  }

  let {
    tabs = [],
    active = $bindable(0),
    classname = ''
  }: Props = $props();
</script>

<div class="inline-flex rounded-md bg-gray-100 p-1">
  {#each tabs as tab, idx}
    <a
      href={tab.href}
      class="px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-colors
        {active === idx 
          ? 'bg-white text-primary shadow-sm font-semibold' 
          : 'text-gray-500 hover:text-primary'}"
      aria-current={active === idx ? 'page' : undefined}
      onclick={() => active = idx}
    >
      {tab.label}
    </a>
  {/each}
</div>