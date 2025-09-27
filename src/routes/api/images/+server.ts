import { readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import type { RequestHandler } from '@sveltejs/kit';

// 获取uploads文件夹路径
// 开发环境：运行npm run start时，process.cwd()指向build目录，uploads在上级目录
// 生产环境：运行node index.js时，process.cwd()指向项目根目录，uploads在同级目录
const getUploadsDir = async () => {
  const cwd = process.cwd();
  
  // 如果当前目录是build目录（开发环境运行npm run start）
  if (cwd.endsWith('/build') || cwd.endsWith('\\build')) {
    // 开发环境：build目录和uploads目录同级
    return join(dirname(cwd), 'uploads');
  }
  
  // 生产环境：uploads目录就在当前目录下
  return join(cwd, 'uploads');
};

type SortOption = 'time-desc' | 'time-asc' | 'name' | 'size-desc' | 'size-asc';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const sortParam = url.searchParams.get('sort') as SortOption || 'time-desc';
		const uploadsDir = await getUploadsDir();
		const files = await readdir(uploadsDir);
		// 忽略内部或系统文件
		const IGNORE_FILES = new Set(['.clipboard.json', '.DS_Store', 'Thumbs.db', '.gitkeep']);
		const IGNORE_PATTERNS = [
			/^~\$.+/i, // Office 临时文件
			/.+\.(tmp|part|partial|crdownload)$/i // 常见临时/下载中后缀
		];
		const shouldIgnore = (name: string) => {
			if (IGNORE_FILES.has(name)) return true;
			for (const re of IGNORE_PATTERNS) if (re.test(name)) return true;
			return false;
		};
		const allFiles = files.filter((name) => !shouldIgnore(name));
		
		// Get file stats
		const filesWithStats = await Promise.all(
			allFiles.map(async (name) => {
				const filePath = join(uploadsDir, name);
				const stats = await stat(filePath);
				const ext = name.split('.').pop()?.toLowerCase() || '';
				return {
					filename: name,
					url: `/files/${encodeURIComponent(name)}`,
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


