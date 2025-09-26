# Simple Drive 组件库

这个目录包含了 Simple Drive 应用的所有可复用组件。

## 组件结构

### Header.svelte
- **功能**: 页面头部组件
- **包含**: 应用标题和口号
- **样式**: 粘性定位，毛玻璃效果

### Footer.svelte
- **功能**: 页面底部组件
- **包含**: 文件上传区域、拖拽上传、进度条
- **Props**:
  - `uploading`: 是否正在上传
  - `uploadProgress`: 上传进度 (0-100)
  - `isDragOver`: 是否拖拽悬停
  - `errorMessage`: 错误信息
  - 各种事件处理函数

### Main.svelte
- **功能**: 主要内容区域组件
- **包含**: 文件列表、排序、布局切换、预览、确认对话框
- **Props**:
  - `images`: 文件列表数据
  - `myUploads`: 本机上传的文件集合
  - `activeTab`: 当前激活的标签页
  - `sortBy`: 排序方式
  - `layout`: 布局模式 (grid/list)
  - `preview`: 预览文件信息
  - `confirmModal`: 确认对话框状态
  - `toasts`: 提示消息列表
  - 各种事件处理函数

### FileCard.svelte
- **功能**: 网格布局中的文件卡片组件
- **包含**: 文件预览、文件名、操作按钮
- **Props**:
  - `file`: 文件信息对象
  - `onPreview`: 预览事件处理函数
  - `onDownload`: 下载事件处理函数
  - `onDelete`: 删除事件处理函数

### FileList.svelte
- **功能**: 列表布局中的文件列表组件
- **包含**: 文件列表表格、响应式列显示
- **Props**:
  - `files`: 文件数组
  - `onPreview`: 预览事件处理函数
  - `onDownload`: 下载事件处理函数
  - `onDelete`: 删除事件处理函数

### PreviewModal.svelte
- **功能**: 文件预览模态框组件
- **包含**: 图片预览、文件图标显示，层级高于 footer
- **Props**:
  - `preview`: 预览文件信息
  - `onClose`: 关闭事件处理函数

### ConfirmModal.svelte
- **功能**: 确认对话框组件
- **包含**: 确认提示、取消/确认按钮
- **Props**:
  - `confirmModal`: 确认对话框状态对象
  - `onHide`: 隐藏事件处理函数
  - `onConfirm`: 确认事件处理函数

### ToastContainer.svelte
- **功能**: 提示消息容器组件
- **包含**: 成功/错误提示消息显示，顶部居中展示
- **Props**:
  - `toasts`: 提示消息数组

### ButtonGroup.svelte
- **功能**: 通用按钮组组件
- **包含**: 支持排序和布局两种变体的按钮组
- **Props**:
  - `buttons`: 按钮配置数组
  - `onButtonClick`: 按钮点击事件处理函数
  - `variant`: 按钮组变体 ('sort' | 'layout')

### SortGroup.svelte
- **功能**: 排序按钮组组件
- **包含**: 时间、文件名、大小排序按钮
- **Props**:
  - `sortBy`: 当前排序方式
  - `onSortChange`: 排序变更事件处理函数

### LayoutGroup.svelte
- **功能**: 布局切换按钮组组件
- **包含**: 网格和列表布局切换按钮
- **Props**:
  - `layout`: 当前布局模式
  - `onLayoutChange`: 布局变更事件处理函数

### Tabs.svelte
- **功能**: 通用标签页组件
- **包含**: 可配置的标签页按钮组
- **Props**:
  - `tabs`: 标签页配置数组
  - `onTabChange`: 标签页切换事件处理函数

### TabGroup.svelte
- **功能**: 文件标签页组件
- **包含**: 所有上传和本机上传标签页
- **Props**:
  - `activeTab`: 当前激活的标签页
  - `onTabChange`: 标签页切换事件处理函数

## 使用方式

### 基本使用
```svelte
<script>
  import { Header, Footer, Main } from '$lib/components';
</script>

<Header />
<Main {data} {handlers} />
<Footer {uploadState} {handlers} />
```

### 子组件使用
```svelte
<script>
  import { 
    FileCard, FileList, PreviewModal, ConfirmModal, ToastContainer,
    SortGroup, LayoutGroup, ButtonGroup, TabGroup, Tabs 
  } from '$lib/components';
</script>

<!-- 标签页控制 -->
<TabGroup {activeTab} {onTabChange} />

<!-- 排序和布局控制 -->
<div class="sort-controls">
  <SortGroup {sortBy} {onSortChange} />
  <div class="layout-toggle">
    <LayoutGroup {layout} {onLayoutChange} />
  </div>
</div>

<!-- 网格布局 -->
<div class="grid">
  {#each files as file}
    <FileCard {file} {onPreview} {onDownload} {onDelete} />
  {/each}
</div>

<!-- 列表布局 -->
<FileList {files} {onPreview} {onDownload} {onDelete} />

<!-- 模态框和提示 -->
<PreviewModal {preview} onClose={() => preview = null} />
<ConfirmModal {confirmModal} onHide={hideConfirm} onConfirm={handleConfirm} />
<ToastContainer {toasts} />

<!-- 自定义按钮组 -->
<ButtonGroup 
  buttons={[
    { key: 'option1', label: '选项1', active: selected === 'option1' },
    { key: 'option2', label: '选项2', active: selected === 'option2' }
  ]} 
  onButtonClick={(key) => selected = key}
  variant="sort"
/>

<!-- 自定义标签页 -->
<Tabs 
  tabs={[
    { key: 'tab1', label: '标签页1', active: currentTab === 'tab1' },
    { key: 'tab2', label: '标签页2', active: currentTab === 'tab2' },
    { key: 'tab3', label: '标签页3', active: currentTab === 'tab3' }
  ]} 
  onTabChange={(key) => currentTab = key}
/>
```

## 工具函数

项目提供了共享的工具函数，位于 `src/lib/utils/fileUtils.ts`：

- `getFileIcon(format)`: 根据文件格式获取对应的图标组件
- `isImageFile(format)`: 判断是否为图片文件
- `formatFileSize(bytes)`: 格式化文件大小
- `formatDate(dateString)`: 格式化日期时间

## 组件特点

1. **模块化**: 每个组件职责单一，便于维护
2. **可复用**: 组件设计考虑了复用性
3. **类型安全**: 使用 TypeScript 提供完整的类型定义
4. **响应式**: 所有组件都支持响应式设计
5. **样式隔离**: 每个组件都有自己的样式文件
6. **工具函数共享**: 避免重复代码，提高维护性

## 开发指南

### 添加新组件
1. 在 `src/lib/components/` 目录下创建新的 `.svelte` 文件
2. 在 `index.ts` 中导出新组件
3. 确保组件有完整的 TypeScript 类型定义
4. 添加必要的样式和响应式支持

### 修改现有组件
1. 确保修改不会影响组件的公共 API
2. 更新相关的 TypeScript 类型定义
3. 测试组件在不同屏幕尺寸下的表现
4. 更新文档说明

## 样式规范

- 使用 CSS 变量定义主题色彩
- 遵循响应式设计原则
- 保持组件样式的独立性
- 使用语义化的 CSS 类名
