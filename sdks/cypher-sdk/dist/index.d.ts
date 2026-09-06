type UploadVideoRespose = {
    key: string;
};
type UploadVideoFields = {
    title: string;
    description?: string;
    thumbnail?: File;
    timestamps?: string[];
    playlist?: string;
    genreateSubtitles?: boolean;
    tags?: string[];
    includeWatermark?: boolean;
    video: File;
};
type UploadVideoTypes = {
    title: string;
    description?: string;
    videoDuration: number;
    videoFileName: string;
    videoContentType: string;
    videoSize: number;
    thumbnailFileName: string;
    thumbnailContentType: string;
    thumbnailSize: number;
    timestamps?: string[];
    playlist?: string;
    genreateSubtitles?: boolean;
    tags?: string[];
    includeWatermark?: boolean;
    type: string;
};
type CypherOptions = {
    apiKey: string;
};

type onProgressType = {
    onProgress?: (progress: {
        loaded: number;
        total: number;
        precent: number;
    }) => void;
};
declare class Cypher {
    static uploadVideo(options: UploadVideoFields, onProgress: onProgressType, alternateProxyUrl?: string): Promise<UploadVideoRespose>;
}
declare const cypher: typeof Cypher;

declare function handleProcessRequest({ req, apiKey }: {
    req: Request;
    apiKey: string;
}): Promise<Response>;

export { type CypherOptions, type UploadVideoFields, type UploadVideoRespose, type UploadVideoTypes, cypher, handleProcessRequest };
