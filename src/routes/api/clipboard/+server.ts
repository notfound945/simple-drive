import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { eventBus } from '$lib/server/events';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';

type ClipboardItem = {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

// 复用 uploads 目录的定位逻辑，确保在 build 下也能找到
const getUploadsDir = () => {
  const cwd = process.cwd();
  if (cwd.endsWith('/build') || cwd.endsWith('\\build')) {
    return join(dirname(cwd), 'uploads');
  }
  return join(cwd, 'uploads');
};

const uploadsDir = getUploadsDir();
const storePath = join(uploadsDir, '.clipboard.json');

async function ensureUploadsDirExists() {
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch {}
}

async function loadItems(): Promise<ClipboardItem[]> {
  try {
    const buf = await readFile(storePath);
    const list = JSON.parse(buf.toString());
    if (Array.isArray(list)) return list as ClipboardItem[];
    return [];
  } catch {
    return [];
  }
}

async function saveItems(items: ClipboardItem[]): Promise<void> {
  await ensureUploadsDirExists();
  await writeFile(storePath, JSON.stringify(items, null, 2));
}

export const GET: RequestHandler = async () => {
  const items = await loadItems();
  return json(items);
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const textRaw = typeof body.text === 'string' ? body.text : '';
    const text = textRaw.trim();
    if (!text) {
      return json({ error: '内容不能为空' }, { status: 400 });
    }
    if (text.length > 10000) {
      return json({ error: '内容过长（最多10000字符）' }, { status: 413 });
    }

    const items = await loadItems();
    const now = new Date().toISOString();
    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const item: ClipboardItem = { id, text, createdAt: now, updatedAt: now };
    items.unshift(item);
    await saveItems(items);
    eventBus.emit('clipboard');
    return json(item, { status: 201 });
  } catch (err) {
    return json({ error: '创建失败' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request, url }) => {
  try {
    const id = url.searchParams.get('id');
    if (!id) return json({ error: '缺少 id' }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const textRaw = typeof body.text === 'string' ? body.text : '';
    const text = textRaw.trim();
    if (!text) return json({ error: '内容不能为空' }, { status: 400 });
    if (text.length > 10000) return json({ error: '内容过长（最多10000字符）' }, { status: 413 });

    const items = await loadItems();
    const idx = items.findIndex((it) => it.id === id);
    if (idx === -1) return json({ error: '未找到条目' }, { status: 404 });
    const now = new Date().toISOString();
    items[idx] = { ...items[idx], text, updatedAt: now };
    await saveItems(items);
    eventBus.emit('clipboard');
    return json(items[idx]);
  } catch (err) {
    return json({ error: '更新失败' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ url }) => {
  try {
    const id = url.searchParams.get('id');
    if (!id) return json({ error: '缺少 id' }, { status: 400 });
    const items = await loadItems();
    const next = items.filter((it) => it.id !== id);
    if (next.length === items.length) return json({ error: '未找到条目' }, { status: 404 });
    await saveItems(next);
    eventBus.emit('clipboard');
    return new Response(null, { status: 204 });
  } catch (err) {
    return json({ error: '删除失败' }, { status: 500 });
  }
};

export const OPTIONS: RequestHandler = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'access-control-allow-headers': 'content-type'
    }
  });
};


