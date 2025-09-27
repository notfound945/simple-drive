import { json } from '@sveltejs/kit';
import { unlink } from 'fs/promises';
import { join, dirname } from 'path';
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

export async function DELETE({ request, url }) {
  try {
    // 从URL参数中获取文件名
    const filename = url.searchParams.get('filename');
    
    if (!filename) {
      return json({ error: '文件名不能为空' }, { status: 400 });
    }

    // 验证文件名，防止路径遍历攻击
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return json({ error: '无效的文件名' }, { status: 400 });
    }

    const filePath = join(uploadsDir, filename);
    
    try {
      // 删除文件
      await unlink(filePath);
      
      // 通知所有客户端文件已删除
      eventBus.emit('images');
      
      // 返回成功响应
      return new Response(null, { status: 204 });
    } catch (error: any) {
      // 文件不存在或其他错误
      if (error.code === 'ENOENT') {
        return json({ error: '文件不存在' }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error('删除文件失败:', error);
    return json({ error: '删除文件失败' }, { status: 500 });
  }
}
