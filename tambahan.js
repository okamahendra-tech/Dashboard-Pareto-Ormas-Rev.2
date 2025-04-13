document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const fileTableBody = document.getElementById('fileTableBody');
  const previewContainer = document.getElementById('previewContainer');
  const uploadStatus = document.getElementById('uploadStatus');
  
  // Prevent default drag behaviors
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
  });

  // Highlight drop zone when dragging over it
  ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, unhighlight, false);
  });

  // Handle dropped files
  dropZone.addEventListener('drop', handleDrop, false);
  fileInput.addEventListener('change', handleFileSelect, false);

  function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
  }

  function highlight(e) {
      dropZone.classList.add('drag-over');
  }

  function unhighlight(e) {
      dropZone.classList.remove('drag-over');
  }

  function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles(files);
  }

  function handleFileSelect(e) {
      const files = e.target.files;
      handleFiles(files);
  }

  function handleFiles(files) {
      previewContainer.classList.remove('hidden');
      [...files].forEach(uploadFile);
  }

  function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function uploadFile(file) {
      // Validate file type
      if (!file.name.match(/\.(xlsx|xls)$/)) {
          showError('Please upload only Excel files (.xlsx or .xls)');
          return;
      }

      // Create table row for the file
      const row = document.createElement('tr');
      row.className = 'file-item';
      row.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                  <svg class="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-sm text-gray-900">${file.name}</span>
              </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${formatFileSize(file.size)}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
              <span class="status-pending px-2 py-1 text-xs rounded-full">
                  Pending
              </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button class="text-red-600 hover:text-red-900" onclick="this.closest('tr').remove()">
                  Delete
              </button>
          </td>
      `;

      fileTableBody.appendChild(row);

      // Simulate file upload
      simulateUpload(row, file);
  }

  function simulateUpload(row, file) {
      const statusCell = row.querySelector('td:nth-child(3) span');
      let progress = 0;

      statusCell.textContent = 'Uploading...';
      statusCell.className = 'status-uploading px-2 py-1 text-xs rounded-full';

      const interval = setInterval(() => {
          progress += 10;
          if (progress >= 100) {
              clearInterval(interval);
              statusCell.textContent = 'Completed';
              statusCell.className = 'status-success px-2 py-1 text-xs rounded-full';
          }
      }, 300);
  }

  function showError(message) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4';
      errorDiv.role = 'alert';
      errorDiv.innerHTML = `
          <span class="block sm:inline">${message}</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg class="fill-current h-6 w-6 text-red-500" role="button" onclick="this.parentElement.parentElement.remove()"
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
          </span>
      `;
      document.querySelector('.upload-container').appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 5000);
  }
});