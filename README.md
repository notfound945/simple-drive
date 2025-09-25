# Simple Drive

一个简洁优雅的局域网文件共享系统，基于 SvelteKit 构建。

## ✨ 功能特性

- 🚀 **多文件上传** - 支持拖拽上传，支持各种文件格式
- 📁 **文件管理** - 查看、下载、删除已上传的文件
- 🖼️ **文件预览** - 图片文件支持在线预览
- 📊 **智能分类** - 区分"所有上传"和"本机上传"文件
- 🔄 **实时同步** - 基于 Server-Sent Events 的实时文件列表更新
- 📱 **响应式设计** - 支持网格和列表两种显示模式
- 🎯 **多维度排序** - 按时间、文件名、大小排序
- 🎨 **现代UI** - 简洁美观的用户界面

## 🛠️ 技术栈

- **前端**: SvelteKit + TypeScript
- **后端**: SvelteKit API Routes
- **样式**: CSS + Tailwind CSS
- **文件处理**: Node.js File System API
- **实时通信**: Server-Sent Events

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev

# 或者启动服务器并自动打开浏览器
npm run dev -- --open
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📖 使用说明

1. **上传文件**: 点击"选择文件"按钮或直接拖拽文件到页面
2. **查看文件**: 在文件库中浏览已上传的文件
3. **文件操作**: 
   - 点击图片可预览
   - 点击"下载"按钮下载文件
   - 点击"删除"按钮删除文件
4. **切换视图**: 使用"所有上传"和"本机上传"标签页切换文件视图
5. **排序和布局**: 使用排序按钮和布局切换按钮自定义显示方式

## 📁 项目结构

```
src/
├── lib/
│   ├── icons/          # SVG 图标组件
│   ├── server/         # 服务器端工具
│   └── types/          # TypeScript 类型定义
├── routes/
│   ├── api/            # API 路由
│   │   ├── upload/     # 文件上传接口
│   │   ├── images/     # 文件列表接口
│   │   └── events/     # 实时事件接口
│   └── uploads/        # 文件访问路由
└── app.html            # 应用模板
```

## 🔧 配置说明

- 上传文件存储在 `uploads/` 目录
- 支持的文件类型：图片、文档、视频、音频、压缩包等
- 文件名会自动添加时间戳避免冲突
- 支持中文文件名

## 📝 开发说明

### 添加新的文件类型支持

在 `src/routes/+page.svelte` 中的 `getFileIcon` 函数中添加新的文件扩展名：

```typescript
function getFileIcon(format: string) {
  const ext = format.toLowerCase();
  
  // 添加新的文件类型
  if (['new-format'].includes(ext)) {
    return NewFormatIcon;
  }
  
  // ... 其他类型
}
```

### 自定义样式

项目使用 Tailwind CSS，可以在 `src/routes/+page.css` 中自定义样式。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
