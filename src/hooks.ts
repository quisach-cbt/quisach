import type { Reroute } from "@sveltejs/kit";

const rerouter: Record<string, string> = {
    // "/": "/home",
};

export const reroute: Reroute = ({ url }) => {   
    if (url.pathname in rerouter) {
        return rerouter[url.pathname];
    }
}