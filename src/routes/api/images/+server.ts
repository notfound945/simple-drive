import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { RequestHandler } from '@sveltejs/kit';

const uploadsDir = join(process.cwd(), 'uploads');

export const GET: RequestHandler = async () => {
	try {
		const files = await readdir(uploadsDir);
		const images = files
			.filter((name) => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(name))
			.sort((a, b) => (a > b ? -1 : 1));
		return new Response(
			JSON.stringify(
				images.map((name) => ({
					filename: name,
					url: `/uploads/${encodeURIComponent(name)}`
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


