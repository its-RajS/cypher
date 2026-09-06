import { verifyApiKeySignature } from "../utils/verifyApiKeySignature.js";
import { completeUpload } from "./completeUpload.js";
import { initiateUpload } from "./initiateUpload.js";
import { uploadThumbnail } from "./uploadThumbnail.js";


export async function handleProcessRequest({
    req, apiKey
}:{
    req: Request,
    apiKey: string
}) {
    try {        
        if(!apiKey){
            return Response.json(
                {error: "Cypher apikey is required",},
                {status: 401}
            )
        }

        const isValidApiKey = await verifyApiKeySignature(apiKey); 
        if(!isValidApiKey){
            return Response.json(
                {error: "Cypher apikey is required",},
                {status: 401}
            )
        }

        const contentType = req.headers.get("Content-Type") || "";
        if(contentType.includes("multipart/form-data")){
            const FormData = await req.formData();
            const type = FormData.get("type")?.toString();

            if(!type || typeof type !== "string"){
                return Response.json(
                    {error: "Invalid request type",},
                    {status: 400}
                )
            }

            switch(type){
                case "upload-thumbnail":{
                    const videoId = FormData.get("videoId")?.toString();
                    const thumbnail = FormData.get("thumbnail") as File;
                    const thumbnailFileName = FormData.get("thumbnailFileName")?.toString();
                    const thumbnailContentType = FormData.get("thumbnailContentType")?.toString();
                    const thumbnailSize = FormData.get("thumbnailSize")?.toString();

                    if(!videoId || typeof videoId !== "string"){
                        return Response.json(
                            {error: "VideoId is required",},
                            {status: 400}
                        )
                    }

                    if(!(thumbnail instanceof File)){
                        return Response.json(
                            {error: "Thumbnail is required",},
                            {status: 400}
                        )
                    }

                    const uploadThumbnailRes = await uploadThumbnail({
                        apiKey,
                        videoId,
                        thumbnail,
                        thumbnailFileName: thumbnailFileName || thumbnail.name,
                        thumbnailContentType: thumbnailContentType || thumbnail.type,
                        thumbnailSize: thumbnailSize || thumbnail.size.toString()
                    })

                    return Response.json(
                        {thumbnailData: uploadThumbnailRes},
                        {status: 200}
                    )
                }
                default:
                    return Response.json(
                        {error: "Invalid request type",},
                        {status: 400}
                    )
            }
        }

        const body = await req.json();
        const {type, ...data} = body;

        if(!type){
            return Response.json(
                {error: "Invalid request type",},
                {status: 400}
            )
        }
        switch(type){
            case "upload": {
                const initiateUploadRes = await initiateUpload({body: data, apiKey});
                return Response.json(
                    {data: initiateUploadRes},
                    {status: 200}
                )
            }

            case "complete": {
                const completeUploadRes = await completeUpload({
                    objectId: data.objectId,
                    uploadId:data.uploadId,
                    key: data.key,
                    parts: data.parts,
                    videoId:data.videoId,
                    apiKey
                })
 
                return Response.json(
                    {trackingData: completeUploadRes}
                )
            }
            default:
                return Response.json(
                    {error: "Invalid request type",},
                    {status: 400}
                )
        }
    } catch (error) {
        const message = error || "an unexpected error occurred"
        return Response.json(
            {error: message},
            {status: 500}
        )
    }
}
