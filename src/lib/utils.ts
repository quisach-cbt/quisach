import { clsx, type ClassArray } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names using clsx and tailwind-merge.
 * @param inputs The class names to merge.
 * @returns Merged class names.
 */
export function cn(...inputs: ClassArray): string {
	return twMerge(clsx(inputs));
}

function plrl(count: number, word: string): string {
	return count === 1 ? word : `${word}s`;
}

/**
 * Get the relative time from a date.
 * @example
 * ```ts
 * getRelativeTime(new Date('2023-01-01')) // '1 year ago'
 * getRelativeTime(new Date()) // 'Just now'
 * ```
 * @param date The date to get the relative time from.
 * @returns The relative time string.
 */
export function getRelativeTime(date: Date): string {
	const diff = new Date().getTime() - date.getTime();
	for (const { label, value } of [
		{ label: 'year', value: 1000 * 60 * 60 * 24 * 365 },
		{ label: 'month', value: 1000 * 60 * 60 * 24 * 30 },
		{ label: 'day', value: 1000 * 60 * 60 * 24 },
		{ label: 'hour', value: 1000 * 60 * 60 },
		{ label: 'minute', value: 1000 * 60 },
		{ label: 'second', value: 1000 }
	]) {
		const count = Math.floor(diff / value);
		if (count > 0) return `${count} ${plrl(count, label)} ago`;
	}
	return 'Just now';
}

export function formatDate(date: string | Date): string {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}
