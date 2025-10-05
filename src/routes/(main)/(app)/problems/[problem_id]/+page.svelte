<script lang="ts">
	import { Head1, Head4, Head5, Head6 } from '$lib/components/ui/heading';
	import { Button } from '$lib/components/ui/button';
	import { ProblemFooter } from '$lib/components/layout/footer';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import { Play, Send, PanelRightClose, PanelRightOpen, FileInput, FileOutput, Hourglass, MemoryStick } from '@lucide/svelte';
	import parseMarkdown from '$lib/markdown_parsers/problem';
	import CodeMirror from 'svelte-codemirror-editor';
	import { cpp } from '@codemirror/lang-cpp';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const { name, description, problemDetail } = data.problem;

	let source = $state<string>(`#include <iostream>
using namespace std;

int main() {

	return 0;
}`);
	let input = $state<string>('');
	let output = $state<string>('');
	let showCodeEditor = $state<boolean>(true);

	async function runCode() {
		const response = await fetch('https://judge.btoi.info.vn/api/runcode', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ source, stdin: input, lang: 'cpp' }),
			redirect: 'follow'
		});

		if (response.ok) {
			const result = await response.json();
			output = (result.output as string) ?? 'No output';
		} else {
			console.error('Error:', response.statusText);
		}
	}

	function handleTextAreaKeyDown(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault();
			if (event.target instanceof HTMLTextAreaElement) {
				let input = event.target.value;
				const start = event.target.selectionStart;
				const end = event.target.selectionEnd;
				input = input.substring(0, start) + '\t' + input.substring(end);
				event.target.value = input;
				event.target.selectionStart = event.target.selectionEnd = start + 1;
			}
		}
	}
</script>

<svelte:head>
	<title>Problem: {name} - BTOI Platform</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="grow h-[calc(100vh-4rem)]">
	<PaneGroup direction="horizontal" autoSaveId="problem_panes" class="w-full">
		<Pane defaultSize={50} minSize={30} order={1} class="grid grid-rows-[auto_1fr]">
			<nav class="flex items-center justify-between h-12 px-4 border-b">
				<span>{name}</span>
				<Button variant="outline" size="icon" aria-label="{showCodeEditor ? 'Close': 'Open'} code editor" onclick={() => (showCodeEditor = !showCodeEditor)}>
					{#if showCodeEditor}
						<PanelRightClose />
					{:else}
						<PanelRightOpen />
					{/if}
				</Button>
			</nav>
			<div class="overflow-y-auto">
				<article class="px-8 py-4 space-y-4 text-md">
					<Head1>{name}</Head1>
					{#if problemDetail}
						{@const problemConstraints = [
							{ icon: FileInput, title: 'Input', value: problemDetail.input },
							{ icon: FileOutput, title: 'Output', value: problemDetail.output },
							{ icon: Hourglass, title: 'Time limit', value: `${problemDetail.timelimit}ms` },
							{ icon: MemoryStick, title: 'Memory limit', value: `${problemDetail.memorylimit / 1024}KB` }
						]}
						<div class="text-sm grid grid-cols-2 max-w-64">
							{#each problemConstraints as { icon: Icon, title, value } }
								<span class="font-semibold"><Icon class="inline" size={16}/> {title}</span>
								<span class="font-mono text-gray-500">{value}</span>
							{/each}
						</div>
						{@const problemSource = [
							{ title: 'Statement', value: problemDetail.statement },
							{ title: 'Input', value: problemDetail.inputFormat },
							{ title: 'Output', value: problemDetail.outputFormat },
							{ title: 'Constraints', value: problemDetail.constraints }
						]}
						{#each problemSource as { title, value }}
							{#if value}
								<section class="space-y-2">
									<Head5>{title}</Head5>
									{#await parseMarkdown(value)}
										Loading...
									{:then value}
										{@html value}
									{/await}
								</section>
							{/if}
						{/each}
						{#if problemDetail.sampleTestCases}
							<div class="space-y-4">
								<Head4>Sample tests</Head4>
								{#each problemDetail.sampleTestCases as { input: testInput, output: testOutput, explanation }, index}
									<div class="p-2 space-y-2 border rounded-md">
										<div class="flex items-center justify-between">
											<Head5>Test {index + 1}</Head5>
											<Button
												variant="ghost"
												size="sm"
												onclick={() => {
													input = testInput;
												}}>Use this test</Button
											>
										</div>
										<div class="p-2 border rounded-sm">
											<pre>{testInput}</pre>
										</div>
										<div class="p-2 border rounded-sm">
											<pre>{testOutput}</pre>
										</div>
										{#if explanation}
											<Head6>Explanation</Head6>
											<p class="p-2">
												{#await parseMarkdown(explanation)}
													Loading...
												{:then value}
													{@html value}
												{/await}
											</p>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					{/if}
				</article>
				<ProblemFooter />
			</div>
		</Pane>
		{#if showCodeEditor}
			<PaneResizer class="relative flex items-center justify-center w-3 bg-gray-200">
				<div class="z-10 w-2 bg-gray-300 rounded-sm h-7"></div>
			</PaneResizer>
			<Pane defaultSize={50} order={2}>
				<PaneGroup direction="vertical">
					<Pane
						class="grid grid-rows-[auto_minmax(0,1fr)]"
						defaultSize={2 / 3}
						minSize={20}
						maxSize={80}
					>
						<nav class="flex items-center justify-between h-12 px-4 border-b">
							<div></div>
							<div class="space-x-2">
								<Button size="sm" onclick={runCode}>
									<Play size={16} />Run Code
								</Button>
								<Button size="sm" onclick={runCode}>
									<Send size={16} />Submit
								</Button>
							</div>
						</nav>
						<CodeMirror
							bind:value={source}
							lang={cpp()}
							tabSize={4}
							placeholder="Write your code here..."
							styles={{
								'&': {
									fontSize: '1.1rem',
									maxWidth: '100%',
									height: '100%'
								}
							}}
						/>
					</Pane>
					<PaneResizer class="relative flex items-center justify-center h-1 bg-gray-200"></PaneResizer>
					<Pane defaultSize={1 / 3}>
						<div class="flex h-full">
							<label class="flex flex-col w-1/2 p-2 space-y-1 border-r">
								Input
								<textarea class="flex-1 text-nm whitespace-pre font-mono p-2 border rounded-md" onkeydown={handleTextAreaKeyDown} bind:value={input}></textarea>
							</label>
							<label class="flex flex-col w-1/2 p-2 space-y-1">
								Output
								<textarea class="flex-1 text-nm whitespace-pre font-mono p-2 border rounded-md" onkeydown={handleTextAreaKeyDown} bind:value={output}></textarea>
							</label>
						</div>
					</Pane>
				</PaneGroup>
			</Pane>
		{/if}
	</PaneGroup>
</div>
