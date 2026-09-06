import { getEnvConfig } from "../configs/index.js"
import { UploadVideoTypes } from "../types/index.js"

type InitiateUploadType = {
    body : UploadVideoTypes,
    apiKey: string
}


export async function initiateUpload({ body, apiKey }: InitiateUploadType ) {
    try {
        const {baseUrl} = getEnvConfig()
                
        const response = await fetch(`${baseUrl}/upload/initiate`, {
            method: "POST",
            headers: {
                "x-api-key": apiKey
            },
            body: JSON.stringify({
                ...body
            })
        })
        
        const uploadData = await response.json()
        
        if(!response.ok) {
            throw new Error(uploadData.message || "Failed to initiate upload")
        }
        return uploadData
        
    } catch (error) {
        console.log("Failed to initiate upload", error)
        throw error
    }
}