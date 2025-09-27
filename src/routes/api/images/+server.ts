import { readdir, stat, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import type { RequestHandler } from '@sveltejs/kit';

// 获取项目根目录的uploads文件夹
// 在开发环境中，process.cwd() 指向项目根目录
// 在生产环境中，process.cwd() 指向build目录，需要向上查找
const getUploadsDir = async () => {
  const cwd = process.cwd();
  
  // 如果当前目录是build目录
  if (cwd.endsWith('/build') || cwd.endsWith('\\build')) {
    // 检查build目录下是否有uploads
    const uploadsInBuild = join(cwd, 'uploads');
    // 检查上级目录是否有uploads（开发环境情况）
    const uploadsInParent = join(dirname(cwd), 'uploads');
    
    try {
      // 优先检查build目录下的uploads
      await access(uploadsInBuild);
      return uploadsInBuild;
    } catch {
      try {
        // 如果build目录下没有，检查上级目录
        await access(uploadsInParent);
        return uploadsInParent;
      } catch {
        // 如果都没有，默认返回上级目录（开发环境）
        return uploadsInParent;
      }
    }
  }
  
  // 否则直接使用当前目录下的uploads
  return join(cwd, 'uploads');
};

type SortOption = 'time-desc' | 'time-asc' | 'name' | 'size-desc' | 'size-asc';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const sortParam = url.searchParams.get('sort') as SortOption || 'time-desc';
		const uploadsDir = await getUploadsDir();
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


