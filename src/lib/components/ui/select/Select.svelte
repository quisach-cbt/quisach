<script lang='ts'>
    import { cn } from "$lib/utils";
    import { ChevronDown, Check } from "@lucide/svelte";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";

    type Option = {
        value: string;
        label: string;
    };

    type ChangeHandler = (value: string) => void;
    type OpenChangeHandler = (isOpen: boolean) => void;

    let {
        options = [
            { value: 'all', label: 'All Categories' },
            { value: 'algorithm', label: 'Algorithms' },
            { value: 'data-structures', label: 'Data Structures' },
            { value: 'math', label: 'Mathematics' },
            { value: 'string', label: 'String Problems' },
            { value: 'graph', label: 'Graph Theory' },
        ] as Option[],
        value = 'all',
        placeholder = 'Select an option',
        label = '',
        disabled = false,
        required = false,
        error = '',
        onChange = (value: string) => {},
        onOpenChange = (isOpen: boolean) => {},
        class: className = ''
    }: {
        options?: Option[],
        value?: string,
        placeholder?: string,
        label?: string,
        disabled?: boolean,
        required?: boolean,
        error?: string,
        onChange?: ChangeHandler,
        onOpenChange?: OpenChangeHandler,
        class?: string
    } = $props();

    let open = $state(false);
    let selectedValue = $state(value);
    let containerElement: HTMLElement | null = null;

    $effect(() => {
        if (value !== selectedValue) {
             selectedValue = value;
        }
    });

    $effect(() => {
        value = selectedValue;
    });

    const selectedLabel = $derived(() => {
        const option = options.find(opt => opt.value === selectedValue);
        return option ? option.label : placeholder;
    });

    function handleSelect(option: Option) {
        selectedValue = option.value;
        onChange(option.value);
        open = false;
        onOpenChange(false);
    }

    function toggleOpen() {
        if (!disabled) {
            const newState = !open;
            open = newState;
            onOpenChange(newState);
        }
    }

    function handleClickOutside(event: MouseEvent) {
        if (open && containerElement && !containerElement.contains(event.target as Node)) {
            open = false;
            onOpenChange(false);
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside, true); 
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    });
</script>

<div 
    class={cn("relative w-full", className)}
    bind:this={containerElement}
>
    {#if label}
        <label 
            for="select-trigger"
            class="block text-sm font-medium mb-2 text-gray-900"
        >
            {label} {#if required}<span class="text-red-500">*</span>{/if}
        </label>
    {/if}
    
    <button
        type="button"
        id="select-trigger"
        class={cn(
            "font-medium flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm",
            "ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:ring-offset-2",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-default hover:bg-gray-50/50",
            error ? "border-red-500" : "border-gray-200",
            open && "ring-2 ring-gray-950/10 ring-offset-2"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="select-label"
        onclick={toggleOpen}
        disabled={disabled}
    >
        <span class={cn("flex items-center gap-2 truncate", !selectedValue && "text-gray-500")}>
            {selectedLabel()}
        </span>
        <ChevronDown
            class={cn(
                "h-4 w-4 shrink-0 opacity-50 transition-transform duration-200", 
                open && "rotate-180"
            )}
            aria-hidden="true"
        />
    </button>
    
    {#if open}
        <div
            transition:slide={{ duration: 100 }}
            class="font-body absolute z-50 max-h-60 w-full overflow-hidden rounded-md border border-gray-200 bg-white text-gray-900 shadow-md"
            role="listbox"
            tabindex="-1"
        >
            <ul class="overflow-auto p-1 max-h-60">
                {#each options as option}
                    <li
                        class={cn(
                            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
                            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                            selectedValue === option.value ? "bg-primary/10 text-primary font-medium" : "hover:bg-primary/10 focus:bg-primary/10"
                        )}
                        role="option"
                        aria-selected={selectedValue === option.value}
                        onclick={() => handleSelect(option)}
                        tabindex="0"
                        onkeydown={e => e.key === 'Enter' && handleSelect(option)}
                    >
                        {#if selectedValue === option.value}
                            <span class="absolute left-2 flex h-4 w-4 items-center justify-center text-primary">
                                <Check class="h-4 w-4" />
                            </span>
                        {/if}
                        <span>{option.label}</span>
                    </li>
                {/each}
                {#if options.length === 0}
                    <li class="font-body relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm text-gray-500">
                        No options available
                    </li>
                {/if}
            </ul>
        </div>
    {/if}
    
    {#if error}
        <div class="mt-1 text-xs text-red-500">
            {error}
        </div>
    {/if}
</div>
