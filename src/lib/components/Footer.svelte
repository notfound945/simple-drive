<script lang="ts">
  import FileIcon from '$lib/icons/File.svelte';

  export let uploading: boolean = false;
  export let uploadProgress: number = 0;
  export let isDragOver: boolean = false;
  export let errorMessage: string = '';

  // 事件处理函数
  export let onFileChange: (e: Event) => void;
  export let onDragOver: (e: DragEvent) => void;
  export let onDragEnter: (e: DragEvent) => void;
  export let onDragLeave: (e: DragEvent) => void;
  export let onDrop: (e: DragEvent) => void;
</script>

<!-- Footer -->
<footer class="footer">
  <!-- 上传进度条 -->
  {#if uploading}
    <div class="upload-progress">
      <div class="progress-bar" style="width: {uploadProgress}%"></div>
      <div class="progress-text">上传中... {uploadProgress}%</div>
    </div>
  {/if}
  
  <div 
    class="upload-area {isDragOver ? 'dragover' : ''}"
    role="button"
    tabindex="0"
    on:dragover={onDragOver}
    on:dragenter={onDragEnter}
    on:dragleave={onDragLeave}
    on:drop={onDrop}
    on:click={() => document.getElementById('file-input')?.click()}
    on:keydown={(e) => e.key === 'Enter' && document.getElementById('file-input')?.click()}
  >
    <input id="file-input" class="file-input" type="file" multiple on:change={onFileChange} />
    <div class="upload-content">
      <FileIcon size={48} color="#3b82f6" />
      <div class="upload-text">
        <div class="upload-title">拖拽文件到此处上传</div>
        <div class="upload-subtitle">或点击选择文件 (最大 4GB)</div>
      </div>
    </div>
    {#if errorMessage}
      <div class="upload-error">{errorMessage}</div>
    {/if}
  </div>
</footer>

<style>
  /* Footer styles */
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    border-top: 1px solid #e5e7eb;
    padding: 0 0.75rem 0.5rem;
    margin: 0 -0.75rem -0.5rem; /* stretch to container edges */
    width: calc(100% + 1.5rem);
    box-sizing: border-box;
    z-index: 50;
  }

  /* 上传进度条样式 */
  .upload-progress {
    position: relative;
    width: 100%;
    height: 4px;
    background: #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }

  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    transition: width 0.3s ease;
    border-radius: 0 2px 2px 0;
  }

  .progress-text {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: #3b82f6;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.9);
    padding: 4px 12px;
    border-radius: 6px;
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    border: 1px solid rgba(59, 130, 246, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* 拖拽上传区域样式 */
  .upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 16px 16px;
    padding: 32px 24px;
    border: 2px dashed #3b82f6;
    border-radius: 12px;
    background: #eff6ff;
    transition: all 0.2s ease;
    cursor: pointer;
    min-height: 80px;
    width: calc(100% - 32px);
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
  }

  .upload-area:hover {
    border-color: #2563eb;
    background: #dbeafe;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  .upload-area.dragover {
    border-color: #1d4ed8;
    background: #bfdbfe;
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
  }

  .upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .upload-text {
    text-align: center;
  }

  .upload-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 4px;
  }

  .upload-subtitle {
    font-size: 13px;
    color: #3b82f6;
  }

  .upload-error {
    color: #dc2626;
    font-size: 14px;
    text-align: center;
    margin-top: 8px;
    padding: 8px 12px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 6px;
  }

  /* 响应式设计 */
  @media (max-width: 640px) {
    .footer {
      padding: 0.5rem 0.5rem;
      margin: 0 -0.5rem -0.5rem;
      width: calc(100% + 1rem);
    }
    
    .upload-area {
      margin: 12px 12px;
      padding: 24px 20px;
      min-height: 60px;
      border-radius: 8px;
      width: calc(100% - 24px);
      max-width: none;
    }
    
    .upload-title {
      font-size: 15px;
    }
    
    .upload-subtitle {
      font-size: 12px;
    }
  }

  /* 超小屏幕优化 */
  @media (max-width: 480px) {
    .upload-area {
      margin: 8px 8px;
      padding: 20px 16px;
      min-height: 50px;
      width: calc(100% - 16px);
    }
    
    .upload-title {
      font-size: 14px;
    }
    
    .upload-subtitle {
      font-size: 11px;
    }
  }
</style>
