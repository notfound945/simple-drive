# Simple Drive 工具函数库

这个目录包含了 Simple Drive 应用的所有共享工具函数。

## 文件结构

```
src/lib/utils/
├── fileUtils.ts    # 文件处理相关工具函数
├── index.ts        # 工具函数导出文件
└── README.md       # 工具函数文档
```

## 工具函数说明

### fileUtils.ts

#### `getFileIcon(format: string)`
根据文件格式获取对应的图标组件。

**参数:**
- `format`: 文件格式/扩展名（如 'jpg', 'pdf', 'mp4' 等）

**返回值:**
- 对应的 Svelte 图标组件

**支持的文件类型:**
- 图片: png, jpg, jpeg, gif, webp, bmp, svg
- 文档: txt, md, doc, docx, pdf, rtf, xls, xlsx, ppt, pptx, odt, ods, odp, pages, numbers, key
- 视频: mp4, avi, mov, wmv, flv, webm, mkv
- 音频: mp3, wav, flac, aac, ogg, m4a
- 压缩包: zip, rar, 7z, tar, gz, bz2
- JSON: json
- 代码: js, ts, html, css, xml, py, java, cpp, c, php, rb, go, rs

**使用示例:**
```typescript
import { getFileIcon } from '$lib/utils/fileUtils';

const iconComponent = getFileIcon('pdf'); // 返回 FileTextIcon
```

#### `isImageFile(format: string)`
判断是否为图片文件。

**参数:**
- `format`: 文件格式/扩展名

**返回值:**
- `boolean`: 是否为图片文件

**使用示例:**
```typescript
import { isImageFile } from '$lib/utils/fileUtils';

const isImage = isImageFile('jpg'); // true
const isNotImage = isImageFile('pdf'); // false
```

#### `formatFileSize(bytes: number)`
格式化文件大小，将字节数转换为可读的格式。

**参数:**
- `bytes`: 文件大小（字节数）

**返回值:**
- `string`: 格式化后的文件大小字符串（如 "1.5 MB"）

**使用示例:**
```typescript
import { formatFileSize } from '$lib/utils/fileUtils';

const size = formatFileSize(1536000); // "1.5 MB"
const size2 = formatFileSize(1024); // "1.0 KB"
```

#### `formatDate(dateString: string)`
格式化日期时间，将日期字符串转换为中文本地化格式。

**参数:**
- `dateString`: 日期字符串

**返回值:**
- `string`: 格式化后的日期时间字符串（如 "2024/01/15 14:30"）

**使用示例:**
```typescript
import { formatDate } from '$lib/utils/fileUtils';

const date = formatDate('2024-01-15T14:30:00Z'); // "2024/01/15 14:30"
```

## 使用方式

### 导入单个函数
```typescript
import { getFileIcon, isImageFile } from '$lib/utils/fileUtils';
```

### 导入所有函数
```typescript
import { getFileIcon, isImageFile, formatFileSize, formatDate } from '$lib/utils';
```

### 在 Svelte 组件中使用
```svelte
<script lang="ts">
  import { getFileIcon, isImageFile, formatFileSize } from '$lib/utils/fileUtils';
  
  let file = { format: 'pdf', size: 1024000 };
  
  $: iconComponent = getFileIcon(file.format);
  $: isImage = isImageFile(file.format);
  $: sizeText = formatFileSize(file.size);
</script>

{#if isImage}
  <img src={file.url} alt={file.name} />
{:else}
  <svelte:component this={iconComponent} size={32} />
{/if}

<span>{sizeText}</span>
```

## 开发指南

### 添加新的工具函数
1. 在 `fileUtils.ts` 中添加新函数
2. 确保函数有完整的 TypeScript 类型定义
3. 添加 JSDoc 注释说明函数用途
4. 在 `index.ts` 中导出新函数
5. 更新此文档

### 函数设计原则
1. **纯函数**: 函数不应该有副作用
2. **类型安全**: 使用 TypeScript 提供完整的类型定义
3. **文档完整**: 每个函数都应该有清晰的文档说明
4. **测试友好**: 函数应该易于单元测试
5. **性能优化**: 避免不必要的计算和内存分配

## 扩展建议

未来可以考虑添加以下工具函数：

- `getFileTypeCategory(format)`: 获取文件类型分类
- `validateFileType(file, allowedTypes)`: 验证文件类型是否允许
- `generateFileHash(file)`: 生成文件哈希值
- `parseFileName(filename)`: 解析文件名和扩展名
- `getFileMimeType(format)`: 获取文件的 MIME 类型
