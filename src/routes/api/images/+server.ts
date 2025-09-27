import { readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import type { RequestHandler } from '@sveltejs/kit';

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


