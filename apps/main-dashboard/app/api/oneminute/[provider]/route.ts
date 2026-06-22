import { handleStorageRequest } from "@oneminutecloud/storage-bucket-next";

export async function POST(request: Request, props: {params: Promise<{provider: string}>}) {
    return await handleStorageRequest({
        request, 
        props,
        apiKey: process.env.ONEMINUTECLOUD_API_KEY!,
    });
}
