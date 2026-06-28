import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { uploadResume } from '../api/resumeApi.js'

function ResumeUpload({ currentResumeUrl, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max size is 5MB')
      return
    }

    setUploading(true)
    try {
      const res = await uploadResume(file)
      toast.success('Resume uploaded and parsed!')
      onUploadSuccess(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {uploading ? (
          <p className="text-sm text-gray-500">Uploading and parsing resume...</p>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              {currentResumeUrl ? 'Click or drag to upload a new resume' : 'Click or drag your resume here'}
            </p>
            <p className="text-xs text-gray-400 mt-1">PDF only, max 5MB</p>
          </>
        )}
      </div>

      {currentResumeUrl && (
        
          <a href={currentResumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline mt-2 inline-block"
        >
          View current resume →
        </a>
      )}
    </div>
  )
}

export default ResumeUpload