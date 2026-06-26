import cloudinary from './cloudinary.js'

export const uploadBufferToCloudinary = (buffer, folder = 'resumes') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto', // handles PDF properly
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )

    uploadStream.end(buffer)
  })
}