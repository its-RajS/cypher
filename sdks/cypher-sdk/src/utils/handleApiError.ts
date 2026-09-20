export const handleApiError = async (res:Response, context: "initiate" | "complete" | "thumbnail" | "preview"): Promise<never> => {
    const {status} = res;
    if(status === 404){
        throw new Error(
            "Cypher API route not found. " +
            "Make sure youhave created the file at " +
            "app/api/cypher/route.ts",
        )
    }
    
    let errorMessage = `Cypher API error during ${context} phase: `

    switch(context){
        case "initiate":
            errorMessage += "Starting the upload."
            break;
        case "complete":
            errorMessage += "Upload completion."
            break;
        case "thumbnail":
            errorMessage += "Thumbnail completion."
            break;
        case "preview":
            errorMessage += "Video preview generation."
            break;
    }

    try {
        const errData = await res.json()
        if(errData && errData.error){
            errorMessage += errData.error
        }else if(errData && errData.message){
            errorMessage += errData.message
        }
    } catch (error) {
        // If JSON parse fails, use status text
        errorMessage += `HTTP ${status} Error`
    }

    throw new Error(`[Cypher] ${errorMessage}`)
}