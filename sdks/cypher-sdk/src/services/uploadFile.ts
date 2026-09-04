type UploadProgress = {
    loaded: number;
    total: number;
    precent: number;
}

type UploadOptions = {
    onProgress?: (progress: UploadProgress) => void;
}

export async function uploadFile(file: File, uploadData: any, options?: UploadOptions) {
    const {objectId, uploadId, key, partSize, parts} = uploadData
    
    let uploadedParts = 0
    const completedParts: Promise<{partNumber: number, eTag: string}>[] = []

    for(const part of parts){
        const start = (part.partNumber -1) * partSize
        const end = partSize ? Math.min(start + partSize, file.size) : file.size
        const chunk = file.slice(start, end)

        const res = await fetch(part.url, {
            method: "PUT",
            body: chunk
        })

        if(!res.ok){
            throw new Error(`Failed to upload part ${part.partNumber}`)
        }

        const eTag = res.headers.get("ETag")?.replace(/"/g, '')
        if(!eTag){
            throw new Error(`Failed to get ETag for part ${part.partNumber}`)
        }

        completedParts.push(
            Promise.resolve({
                partNumber: part.partNumber,
                eTag: eTag
            })
        )

        uploadedParts += chunk.size
        options?.onProgress?.({
            loaded: uploadedParts,
            total: file.size,
            precent: Math.round((uploadedParts / file.size) * 100)
        })
    }
     return {objectId, uploadId, key, completedParts: await Promise.all(completedParts)}
}