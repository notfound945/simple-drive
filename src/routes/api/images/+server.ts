import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import type { RequestHandler } from '@sveltejs/kit';

const uploadsDir = join(process.cwd(), 'uploads');

type SortOption = 'time-desc' | 'time-asc' | 'name' | 'size-desc' | 'size-asc';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const sortParam = url.searchParams.get('sort') as SortOption || 'time-desc';
		const files = await readdir(uploadsDir);
		const allFiles = files; // Accept all file types
		
		// Get file stats
		const filesWithStats = await Promise.all(
			allFiles.map(async (name) => {
				const filePath = join(uploadsDir, name);
				const stats = await stat(filePath);
				const ext = name.split('.').pop()?.toLowerCase() || '';
				return {
					filename: name,
					url: `/uploads/${encodeURIComponent(name)}`,
					mtime: stats.mtime.getTime(),
					size: stats.size,
					format: ext,
					uploadTime: stats.mtime.toISOString()
				};
			})
		);
		
		// Sort based on parameter
		filesWithStats.sort((a, b) => {
			switch (sortParam) {
				case 'time-desc':
					return b.mtime - a.mtime; // newest first
				case 'time-asc':
					return a.mtime - b.mtime; // oldest first
				case 'name':
					return a.filename.localeCompare(b.filename);
				case 'size-desc':
					return b.size - a.size; // largest first
				case 'size-asc':
					return a.size - b.size; // smallest first
				default:
					return b.mtime - a.mtime; // default to time-desc
			}
		});
		
		return new Response(
			JSON.stringify(
				filesWithStats.map(({ filename, url, size, format, uploadTime }) => ({ 
					filename, 
					url, 
					size, 
					format, 
					uploadTime 
				}))
			),
			{ status: 200, headers: { 'content-type': 'application/json' } }
		);
	} catch {
		return new Response(JSON.stringify([]), {
			status: 200,
			headers: { 'content-type': 'application/json' }
		});
	}
};


