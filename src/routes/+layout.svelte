<script lang="ts">
	import '../app.css';

	let { children } = $props();

	function handlePreloadLoad(event: Event) {
		const link = event.currentTarget;
		if (link instanceof HTMLLinkElement) {
			link.onload = null;
			link.rel = 'stylesheet';
		}
	}
</script>

<link
	rel="preload"
	href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
	as="style"
	onload={handlePreloadLoad}
	integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
	crossorigin="anonymous"
/>

{@render children()}
