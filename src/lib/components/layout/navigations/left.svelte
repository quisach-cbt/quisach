<script lang="ts">
    import { page } from '$app/state';
    import { House, SquareLibrary, Trophy, Building2, UsersRound, Flag, BarChart3, Medal } from '@lucide/svelte';
    import { cn } from '$lib/utils';

    type SideBarLink = {
        icon: typeof House;
        name: string;
        href: string;
    }
    const sideBarLinks: Array<SideBarLink> = [
        { icon: House, name: "Home", href: "/home" },
        { icon: SquareLibrary, name: "All Problems", href: "/problems" },
        { icon: Trophy, name: "Contests", href: "/contests" },
        { icon: BarChart3, name: "Rankings", href: "/rankings" },
        { icon: Building2, name: "Organizations", href: "/organizations" },
        { icon: UsersRound, name: "Groups", href: "/groups" },
        { icon: Flag, name: "Teams", href: "/teams" },
        { icon: Medal, name: "Achievements", href: "/achievements" }
    ];
</script>

<aside class="hidden xl:block min-w-xs border-r">
    <nav class="sticky h-[calc(100vh-4rem)] top-0 p-8 pl-16">
        <ul class="space-y-2 text-md font-body font-medium text-muted">
            {#each sideBarLinks as { icon: Icon, name, href }}
                <li class={cn("hover:bg-gray-200 rounded-md p-2 transition-color duration-200 ease-in-out", page.url.pathname.startsWith(href) && "text-text font-bold")}>
                    <a class="flex items-center gap-2 h-full" {href}>
                        <Icon /> {name}
                    </a>
                </li>
            {/each}
        </ul>
    </nav>
</aside>