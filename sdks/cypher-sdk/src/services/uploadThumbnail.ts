import { getEnvConfig } from "../configs/index.js"

type uploadThumbnailTypes = {
    apiKey: string,
    videoId: string,
    thumbnail: File,
    thumbnailFileName: string,
    thumbnailContentType: string,
    thumbnailSize: string
}

export async function uploadThumbnail({
    apiKey,
    videoId,
    thumbnail,
    thumbnailFileName,
    thumbnailContentType,
    thumbnailSize
}: uploadThumbnailTypes): Promise<{thumbnailKey: string}> {
    try {
        const {baseUrl} = getEnvConfig()

        const formData = new FormData()
        formData.append("videoId", videoId)
        formData.append("thumbnail", thumbnail)
        formData.append("thumbnailFileName", thumbnailFileName)
        formData.append("thumbnailContentType", thumbnailContentType)
        formData.append("thumbnailSize", thumbnailSize)

        
        
        const response = await fetch(`${baseUrl}/upload/thumbnail/upload`, {
            method: "POST",
            headers: {
                "x-api-key": apiKey
            },
            body: formData
        })

        const data = await response.json()

        if(!response.ok) {
            throw new Error(data.message || "Failed to upload thumbnail")
        }

        return data
    } catch (error) {
        if(error instanceof Error) {
            throw error
        }
        throw new Error("Internal server error")
    }
}