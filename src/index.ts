export interface Env {
  resourceName: string
  deployName: string
  apiVersion: string
}

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    if (request.method == "OPTIONS") {
      return handleOptions(request)
    }

    const authKey = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!authKey) {
      return new Response("Not allowed", { status: 403 })
    }

    const url = new URL(request.url)
    const fetchAPI = `https://${env.resourceName}.openai.azure.com/openai/deployments/${env.deployName}/${url.pathname.replace('/v1/', '')}?api-version=${env.apiVersion}`
    request.headers.set('api-key', authKey)

    return await fetch(new Request(fetchAPI, request))
  },
};

async function handleOptions(_request: Request): Promise<Response> {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    }
  })
}

