import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import type { RequestHandler } from '@sveltejs/kit';

const uploadsDir = join(process.cwd(), 'uploads');

export const GET: RequestHandler = async () => {
	try {
		const files = await readdir(uploadsDir);
		const imageFiles = files.filter((name) => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(name));
		
		// Get file stats and sort by modification time (upload time) descending
		const imagesWithStats = await Promise.all(
			imageFiles.map(async (name) => {
				const filePath = join(uploadsDir, name);
				const stats = await stat(filePath);
				return {
					filename: name,
					url: `/uploads/${encodeURIComponent(name)}`,
					mtime: stats.mtime.getTime()
				};
			})
		);
		
		// Sort by upload time (mtime) descending - newest first
		imagesWithStats.sort((a, b) => b.mtime - a.mtime);
		
		return new Response(
			JSON.stringify(
				imagesWithStats.map(({ filename, url }) => ({ filename, url }))
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


