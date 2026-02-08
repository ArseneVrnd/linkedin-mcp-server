import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

let client = null;
let connected = false;

export async function getMcpClient() {
  if (client && connected) return client;

  const mcpUrl = process.env.MCP_SERVER_URL || 'http://127.0.0.1:8000/mcp';

  client = new Client({ name: 'job-tracker', version: '1.0.0' });
  const transport = new StreamableHTTPClientTransport(new URL(mcpUrl));

  try {
    await client.connect(transport);
    connected = true;
    console.log('Connected to MCP server at', mcpUrl);
    return client;
  } catch (err) {
    client = null;
    connected = false;
    throw err;
  }
}

export async function callMcpTool(toolName, args) {
  const c = await getMcpClient();
  const result = await c.callTool({ name: toolName, arguments: args });
  return result;
}

export async function checkMcpStatus() {
  try {
    await getMcpClient();
    return { connected: true };
  } catch {
    return { connected: false };
  }
}
