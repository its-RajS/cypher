import {handleProcessRequest} from "@cypher/sdk"


export async function POST(
    req: Request
) {
   return handleProcessRequest({req, apiKey: process.env.API_KEY as string}) 
}