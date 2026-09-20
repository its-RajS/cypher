import {handleProcessRequest} from "@cypher/sdk"


export async function POST(
    req: Request
) {
   return handleProcessRequest({req, apiKey: process.env.CYPHER_API_KEY as string})
}