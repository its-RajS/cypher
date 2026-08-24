export type UploadVideoRespose = {
    key: string
}

export type UploadVideoFields ={
    title: string,
    description?: string,
    thumbnail?: File,
    timestamps?: string[],
    playlist?:string,
    genreateSubtitles?: boolean,
    tags?:string[],
    includeWatermark?: boolean,
    video: File,
}

export type UploadVideoTypes = {
    title: string,
    description?: string,
    videoDuration: number,
    videoFileName:string,
    videoContentType: string,
    videoSize:number,
    thumbnailFileName: string,
    thumbnailContentType: string,
    thumbnailSize:number,
    timestamps?: string[],
    playlist?:string,
    genreateSubtitles?: boolean,
    tags?:string[],
    includeWatermark?: boolean,
    type: string
}

export type CypherOptions ={
    apiKey:string,
    
}