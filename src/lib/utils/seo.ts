import { getContext, setContext } from 'svelte';

const key = {};

export function setTitleSuffix(titleSuffix: string) {
	setContext(key, titleSuffix);
}

export function getTitleSuffix() {
	return getContext(key) as string;
}