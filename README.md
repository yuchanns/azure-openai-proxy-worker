# 🌩️ Azure OpenAI Proxy Worker

A Cloudflare worker that acts as a proxy to translate requests to the OpenAI API to Azure OpenAI.

## configuration

You can configure your own values in `wrangler.toml`:

```toml
[vars]
resourceName = "yuchanns-openai"
apiVersion = "2023-03-15-preview"
deployName = "gpt35"

```
Once you have updated the configuration, deploy the changes using `wrangler publish`.
