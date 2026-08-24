import { UploadVideoFields, UploadVideoRespose } from "../types/index.js";
import { handleApiError } from "../utils/handleApiError.js";

type onProgressType = {
    onProgress?: (progress: {
        loaded: number,
        total: number,
        precent: number
    }) => void
}

function getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
        if(!file.type.startsWith("video/")){
            resolve(0)
            return
        }
        const video = document.createElement("video"); 
        video.preload = "metadata";
        video.onloadedmetadata = () => {
            resolve(Math.round(video.duration));
            URL.revokeObjectURL(video.src);
        };
        video.onerror = ( ) => {
            resolve(0)
            URL.revokeObjectURL(video.src);
        } 
        video.src = URL.createObjectURL(file); 
    });
}

function extractFileMetadata(file: File | Buffer | Uint8Array ): {
    filename: string,
    size: number,
    contentType: string
} {
    if(typeof File !== 'undefined' && file instanceof File){
        return { 
            filename: file.name,
            size: file.size,
            contentType: file.type || "application/octext-stream"
        }
    }

    return {
        filename: "upload",
        contentType: "application/octext-stream",
        size: (file as Buffer | Uint8Array).byteLength
    }
}

class Cypher {
    static async uploadVideo(options: UploadVideoFields, onProgress: onProgressType, alternateProxyUrl?: string): Promise<UploadVideoRespose> {
        if (!options.video) {
            throw new Error("Video file is required!");
        }
        if(!options.thumbnail){
            throw new Error("Thumbnail file is required!")
        }
        if(!options.thumbnail.type.startsWith("image/")){
            throw new Error("Thumbnail file must need to be valid image file")
        }
        if(!options.title || options.title.trim() === ""){
            throw new Error("Title is required!")
        }

        const videoDuration = getVideoDuration( options.video);
        const {filename: videoFileName, size: videoSize, contentType: videoContentType} = extractFileMetadata(options.video);
        
        const {filename: thumbnailFileName, size: thumbnailSize, contentType: thumbnailContentType} = extractFileMetadata(options.thumbnail);
        
        const reqForwardUrl = alternateProxyUrl || "/api/cypher/"
        const initiateRes = await fetch(reqForwardUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ... (() => {
                    const {video, thumbnail, ...rest} = options;
                    return rest;
                })(),
                videoFileName: videoFileName,
                videoSize: videoSize,
                videoContentType: videoContentType,
                videoDuration: videoDuration,
                thumbnailFileName: thumbnailFileName,
                thumbnailSize: thumbnailSize,
                thumbnailContentType: thumbnailContentType,
                type: "upload"
            })
        })
        
        if(!initiateRes.ok){
            await handleApiError(initiateRes, 'initiate');
        }

        const {uploadData} = await  initiateRes.json()
        
    } 
}

export  const cypher = Cypher;