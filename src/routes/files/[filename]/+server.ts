import { readFile, stat, unlink } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import type { RequestHandler } from '@sveltejs/kit';
import mime from 'mime-types';
import { eventBus } from '$lib/server/events';

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

export const GET: RequestHandler = async ({ params }) => {
	const filename = params.filename;
	if (!filename || filename.includes('..') || filename.includes('/')) {
		return new Response('Not found', { status: 404 });
	}
	const uploadsDir = await getUploadsDir();
	const filePath = join(uploadsDir, filename);
  console.log('filePath === | ===', filePath, uploadsDir);
	try {
		const s = await stat(filePath);
		if (!s.isFile()) throw new Error('not file');
    const data = await readFile(filePath);
		const contentType = mime.lookup(filename) || 'application/octet-stream';
    return new Response(new Uint8Array(data), {
			status: 200,
			headers: {
				'content-type': contentType,
				'cache-control': 'public, max-age=31536000, immutable'
			}
		});
	} catch {
		return new Response('Not found', { status: 404 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
  const filename = params.filename;
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return new Response('Bad request', { status: 400 });
  }
  const uploadsDir = await getUploadsDir();
  const filePath = join(uploadsDir, filename);
  try {
    await unlink(filePath);
    eventBus.emit('images');
    return new Response(null, { status: 204 });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};


