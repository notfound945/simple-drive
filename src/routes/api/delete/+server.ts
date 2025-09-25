import { json } from '@sveltejs/kit';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 获取uploads目录的绝对路径
const uploadsDir = join(__dirname, '../../../../uploads');

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
      
      // 返回成功响应
      return new Response(null, { status: 204 });
    } catch (error) {
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
