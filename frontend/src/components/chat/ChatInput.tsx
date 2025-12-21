import { useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'

interface ChatInputProps {
  onSend: (message: string, file?: File) => void
  disabled?: boolean
  loading?: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  loading = false,
}) => {
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle native file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Dropzone for drag and drop (optional)
  const { getRootProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0])
      }
    },
    disabled,
    noClick: true, // Don't open file dialog on click, only on button
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if ((message.trim() || selectedFile) && !disabled && !loading) {
      onSend(message.trim() || 'X-ray image uploaded', selectedFile || undefined)
      setMessage('')
      setSelectedFile(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4 relative">
      {isDragActive && (
        <div className="absolute inset-0 bg-primary-100 bg-opacity-90 border-2 border-dashed border-primary-600 rounded-lg flex items-center justify-center z-50">
          <p className="text-primary-700 font-medium text-lg">Drop X-ray image here</p>
        </div>
      )}
      {/* File Preview */}
      {selectedFile && (
        <div className="mb-2 flex items-center justify-between bg-gray-100 rounded-lg p-2">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-700 truncate max-w-xs">
              {selectedFile.name}
            </span>
            <span className="text-xs text-gray-500">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <button
            onClick={removeFile}
            className="text-red-500 hover:text-red-700"
            type="button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        {/* File Upload Button */}
        <div {...getRootProps()} className="cursor-pointer">
          {/* Hidden native file input - always use this for reliable file selection */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={disabled || loading}
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!disabled && !loading && fileInputRef.current) {
                // Directly trigger the native file input
                fileInputRef.current.click()
              }
            }}
            disabled={disabled || loading}
            className="p-2 text-gray-600 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Upload X-ray image"
            aria-label="Upload X-ray image"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
        </div>

        {/* Message Input */}
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isDragActive
                ? 'Drop X-ray image here...'
                : 'Type your message... (Press Enter to send)'
            }
            disabled={disabled || loading}
            rows={1}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!message.trim() && !selectedFile) || disabled || loading}
          className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </div>
          ) : (
            'Send'
          )}
        </button>
      </form>

    </div>
  )
}

export default ChatInput

