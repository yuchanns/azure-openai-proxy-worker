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

    if (url.pathname == '/v1/models') {
      return handleModels(request)
    }

    const fetchAPI = `https://${env.resourceName}.openai.azure.com/openai/deployments/${env.deployName}/${url.pathname.replace('/v1/', '')}?api-version=${env.apiVersion}`

    const proxyRequest = new Request(fetchAPI, request)
    proxyRequest.headers.set("api-key", authKey)

    return fetch(proxyRequest)
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

async function handleModels(_request: Request): Promise<Response> {
  const data = {
    "object": "list",
    "data": [{
      "id": "gpt-3.5-turbo",
      "object": "model",
      "created": 1677610602,
      "owned_by": "openai",
      "permission": [{
        "id": "modelperm-M56FXnG1AsIr3SXq8BYPvXJA",
        "object": "model_permission",
        "created": 1679602088,
        "allow_create_engine": false,
        "allow_sampling": true,
        "allow_logprobs": true,
        "allow_search_indices": false,
        "allow_view": true,
        "allow_fine_tuning": false,
        "organization": "*",
        "group": null,
        "is_blocking": false
      }],
      "root": "gpt-3.5-turbo",
      "parent": null
    }]
  };
  const json = JSON.stringify(data, null, 2);

  return new Response(json, {
    headers: { 'Content-Type': 'application/json' },
  });
}
