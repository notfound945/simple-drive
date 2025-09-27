import { writeFile, mkdir, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import type { RequestHandler } from '@sveltejs/kit';
import { eventBus } from '$lib/server/events';

// 获取项目根目录的uploads文件夹
// 在开发环境中，process.cwd() 指向项目根目录
// 在生产环境中，process.cwd() 指向build目录，需要向上查找
const getUploadsDir = () => {
  const cwd = process.cwd();
  // 如果当前目录是build目录，则向上查找uploads
  if (cwd.endsWith('/build') || cwd.endsWith('\\build')) {
    return join(dirname(cwd), 'uploads');
  }
  // 否则直接使用当前目录下的uploads
  return join(cwd, 'uploads');
};

const uploadsDir = getUploadsDir();

async function ensureUploadsDirExists(): Promise<void> {
	try {
		const s = await stat(uploadsDir);
		if (!s.isDirectory()) {
			throw new Error('uploads exists but is not a directory');
		}
	} catch {
		await mkdir(uploadsDir, { recursive: true });
	}
}

function sanitizeFilename(originalName: string): string {
	// Preserve Unicode (including Chinese) while removing unsafe characters
	// 1) Normalize to NFC for consistent filesystem storage
	// 2) Remove path separators, wildcards, quotes, angle brackets, pipes (Windows-unsafe too)
	// 3) Remove control chars
	// 4) Collapse whitespace and trim
	const normalized = originalName.normalize('NFC');
	const withoutUnsafe = normalized
		.replace(/[\\/:*?"<>|]/g, '_')
		.replace(/[\u0000-\u001F\u007F]/g, '_');
	const collapsed = withoutUnsafe.replace(/\s+/g, ' ').trim();
	// Limit length for safety
	const limited = collapsed.slice(0, 100);
	// Avoid empty or dot-only names
	return limited === '' || /^\.+$/.test(limited) ? '文件' : limited;
}

function generateDestinationName(originalName: string): string {
	const ext = extname(originalName);
	const base = sanitizeFilename(originalName.replace(ext, ''));
	const timestamp = Date.now();
	return `${base}_${timestamp}${ext}`;
}

export const POST: RequestHandler = async ({ request, url }) => {
	await ensureUploadsDirExists();

	const form = await request.formData();
	let files = form.getAll('file').filter((f): f is File => f instanceof File);

	// Backwards compatibility: accept single file under different keys
	if (files.length === 0) {
		const maybeSingle = form.get('file') || form.get('files') || form.get('image');
		if (maybeSingle instanceof File) files = [maybeSingle];
	}

	if (files.length === 0) {
		return new Response(JSON.stringify({ error: 'No files provided' }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	const results = [] as { filename: string; url: string }[];
	for (const file of files) {
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const destName = generateDestinationName(file.name);
		const destPath = join(uploadsDir, destName);
		await writeFile(destPath, buffer);
		results.push({ filename: destName, url: `/uploads/${encodeURIComponent(destName)}` });
	}

	// notify listeners
	eventBus.emit('images');

	return new Response(JSON.stringify(results), {
		status: 201,
		headers: { 'content-type': 'application/json' }
	});
};

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	});
};



