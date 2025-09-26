import ImageIcon from '$lib/icons/Image.svelte';
import FileIcon from '$lib/icons/File.svelte';
import FileTextIcon from '$lib/icons/FileText.svelte';
import FileVideoIcon from '$lib/icons/FileVideo.svelte';
import FileAudioIcon from '$lib/icons/FileAudio.svelte';
import FileArchiveIcon from '$lib/icons/FileArchive.svelte';
import FileCodeIcon from '$lib/icons/FileCode.svelte';
import FileJsonIcon from '$lib/icons/FileJson.svelte';

/**
 * 根据文件格式获取对应的图标组件
 * @param format 文件格式/扩展名
 * @returns 对应的图标组件
 */
export function getFileIcon(format: string) {
  const ext = format.toLowerCase();
  
  // Image files
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
    return ImageIcon;
  }
  
  // Document files
  if (['txt', 'md', 'doc', 'docx', 'pdf', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'pages', 'numbers', 'key'].includes(ext)) {
    return FileTextIcon;
  }
  
  // Video files
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext)) {
    return FileVideoIcon;
  }
  
  // Audio files
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(ext)) {
    return FileAudioIcon;
  }
  
  // Archive files
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) {
    return FileArchiveIcon;
  }
  
  // JSON files
  if (['json'].includes(ext)) {
    return FileJsonIcon;
  }
  
  // Code files
  if (['js', 'ts', 'html', 'css', 'xml', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs'].includes(ext)) {
    return FileCodeIcon;
  }
  
  // Default file icon
  return FileIcon;
}

/**
 * 判断是否为图片文件
 * @param format 文件格式/扩展名
 * @returns 是否为图片文件
 */
export function isImageFile(format: string): boolean {
  const ext = format.toLowerCase();
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * 格式化日期时间
 * @param dateString 日期字符串
 * @returns 格式化后的日期时间字符串
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
