<script lang="ts">
  import { onMount } from 'svelte';
  import { Header, Footer, Main } from '$lib/components';
  import './+page.css';

  let selectedFiles: File[] = [];
  let uploading = false;
  let uploadProgress = 0;
  let images: { filename: string; url: string; size: number; format: string; uploadTime: string }[] = [];
  let myUploads = new Set<string>();
  let activeTab: 'mine' | 'all' = 'all';
  let preview: { filename: string; url: string; format: string } | null = null;
  let errorMessage = '';
  let toasts: { id: number; type: 'success' | 'error'; text: string }[] = [];
  let sortBy: 'time-desc' | 'time-asc' | 'name' | 'size-desc' | 'size-asc' = 'time-desc';
  let layout: 'grid' | 'list' = 'grid';
  let isDragOver = false;
  let confirmModal: { show: boolean; title: string; message: string; onConfirm: () => void } = {
    show: false,
    title: '',
    message: '',
    onConfirm: () => {}
  };

  function saveMyUploads() {
    try {
      localStorage.setItem('myUploads', JSON.stringify(Array.from(myUploads)));
    } catch {}
  }

  function loadMyUploads() {
    try {
      const raw = localStorage.getItem('myUploads');
      if (raw) {
        const list: string[] = JSON.parse(raw);
        myUploads = new Set(list);
      }
    } catch {}
  }

  async function fetchImages() {
    try {
      const res = await fetch(`/api/images?sort=${sortBy}`);
      if (!res.ok) throw new Error('加载图片列表失败');
      images = await res.json();
      // prune removed files from myUploads
      const existing = new Set(images.map((i) => i.filename));
      let changed = false;
      for (const name of Array.from(myUploads)) {
        if (!existing.has(name)) {
          myUploads.delete(name);
          changed = true;
        }
      }
      if (changed) saveMyUploads();
    } catch (err) {
      errorMessage = (err as Error).message;
    }
  }

  onMount(() => {
    loadMyUploads();
    fetchImages();
    // listen for server-sent events and auto-refresh
    const es = new EventSource('/api/events');
    es.onmessage = (ev) => {
      if (ev.data === 'images') {
        fetchImages();
      }
    };
    return () => es.close();
  });

  // 文件大小验证函数
  function validateFileSize(files: File[]): boolean {
    const maxSize = 4 * 1024 * 1024 * 1024; // 4GB in bytes
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(', ');
      errorMessage = `文件大小超过限制: ${fileNames}。最大支持 4GB。`;
      pushToast('error', errorMessage);
      return false;
    }
    return true;
  }

  async function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    
    if (!validateFileSize(files)) {
      input.value = '';
      return;
    }
    
    selectedFiles = files;
    if (selectedFiles.length > 0) {
      await uploadFiles();
      // reset input to allow re-selecting the same files again
      input.value = '';
    }
  }

  // 拖拽上传处理
  function onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function onDragEnter(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragOver = true;
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragOver = false;
  }

  async function onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragOver = false;
    
    const files = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
    
    if (!validateFileSize(files)) {
      return;
    }
    
    selectedFiles = files;
    if (selectedFiles.length > 0) {
      await uploadFiles();
    }
  }

  async function uploadFiles() {
    if (selectedFiles.length === 0) return;
    uploading = true;
    uploadProgress = 0;
    errorMessage = '';
    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      // 模拟进度条
      progressInterval = setInterval(() => {
        if (uploadProgress < 90) {
          uploadProgress += Math.random() * 20;
          if (uploadProgress > 90) uploadProgress = 90;
        }
      }, 100);

      const form = new FormData();
      for (const f of selectedFiles) form.append('file', f);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      
      if (progressInterval) clearInterval(progressInterval);
      uploadProgress = 100;
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || '上传失败');
      }
      
      // record uploaded names as "mine"
      try {
        const uploaded: { filename: string; url: string }[] = await res.json();
        for (const it of uploaded) myUploads.add(it.filename);
        saveMyUploads();
      } catch {}
      
      selectedFiles = [];
      await fetchImages();
      pushToast('success', '上传成功');
      
      // 延迟隐藏进度条
      setTimeout(() => {
        uploading = false;
        uploadProgress = 0;
      }, 500);
      
    } catch (err) {
      if (progressInterval) clearInterval(progressInterval);
      errorMessage = (err as Error).message;
      pushToast('error', errorMessage || '上传失败');
      uploading = false;
      uploadProgress = 0;
    }
  }

  function showConfirm(title: string, message: string, onConfirm: () => void) {
    confirmModal = { show: true, title, message, onConfirm };
  }

  function hideConfirm() {
    confirmModal.show = false;
  }

  function handleConfirm() {
    confirmModal.onConfirm();
    hideConfirm();
  }

  async function deleteImage(filename: string) {
    showConfirm(
      '确认删除',
      `确定要删除图片 "${filename}" 吗？此操作不可撤销。`,
      async () => {
        try {
          const res = await fetch(`/api/delete?filename=${encodeURIComponent(filename)}`, { method: 'DELETE' });
          if (!res.ok && res.status !== 204) {
            const errorData = await res.json().catch(() => ({ error: '删除失败' }));
            throw new Error(errorData.error || '删除失败');
          }
          myUploads.delete(filename);
          saveMyUploads();
          await fetchImages();
          pushToast('success', '文件删除成功');
        } catch (err) {
          errorMessage = (err as Error).message;
          pushToast('error', errorMessage);
        }
      }
    );
  }

  $: visibleImages = activeTab === 'mine' ? images.filter((i) => myUploads.has(i.filename)) : images;
  
  // Reactive: refetch when sort changes
  $: if (sortBy) {
    fetchImages();
  }
  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (confirmModal.show) {
        hideConfirm();
      } else {
        preview = null;
      }
    }
  }

  function downloadImage(url: string, filename: string) {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {}
  }

  function pushToast(type: 'success' | 'error', text: string) {
    const id = Date.now() + Math.random();
    toasts = [...toasts, { id, type, text }];
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
    }, 2400);
  }

  // 事件处理函数
  function handleTabChange(tab: 'mine' | 'all') {
    activeTab = tab;
  }

  function handleSortChange(sort: 'time-desc' | 'time-asc' | 'name' | 'size-desc' | 'size-asc') {
    sortBy = sort;
  }

  function handleLayoutChange(layoutType: 'grid' | 'list') {
    layout = layoutType;
  }

  function handlePreview(file: { filename: string; url: string; format: string } | null) {
    preview = file;
  }

  function handleDownload(url: string, filename: string) {
    downloadImage(url, filename);
  }

  function handleDelete(filename: string) {
    deleteImage(filename);
  }

</script>

<main class="page">
  <Header />
  
  <Main 
    {images}
    {myUploads}
    {activeTab}
    {sortBy}
    {layout}
    {preview}
    {confirmModal}
    {toasts}
    onTabChange={handleTabChange}
    onSortChange={handleSortChange}
    onLayoutChange={handleLayoutChange}
    onPreview={handlePreview}
    onDownload={handleDownload}
    onDelete={handleDelete}
    {onKeydown}
    {hideConfirm}
    {handleConfirm}
  />
</main>

<Footer 
  {uploading}
  {uploadProgress}
  {isDragOver}
  {errorMessage}
  {onFileChange}
  {onDragOver}
  {onDragEnter}
  {onDragLeave}
  {onDrop}
/>
