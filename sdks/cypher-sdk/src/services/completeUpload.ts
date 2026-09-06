import { getEnvConfig } from "../configs/index.js"

type completeUploadType = {
    objectId : string,
    uploadId: string,
    key: string,
    parts: string[],
    videoId: string,
    apiKey: string
}

export async function completeUpload ({
    objectId, uploadId, key, parts, videoId, apiKey
}: completeUploadType,) {
    try {
        const {baseUrl} = getEnvConfig()
        
        const response = await fetch(`${baseUrl}/upload/complete`, {
            method: "PUT",
            headers: {
                "Content-type" : "application/json",
                "x-api-key": apiKey
            },
            body: JSON.stringify({
                objectId, uploadId, key, parts, videoId,
            })
        })
            
        const trackingData = await response.json()
            
        if(!response.ok) {
            throw new Error(trackingData.message || "Failed to initiate upload")
        }
        return trackingData
            
    } catch (error) {
    console.log("Failed to initiate upload", error)
        throw error
    }
}