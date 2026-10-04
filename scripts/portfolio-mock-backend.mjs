import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const host = '127.0.0.1';
const port = Number(process.env.MOCK_BACKEND_PORT || 8080);

const config = {
  status: true,
  name: 'AskIn',
  version: 'portfolio-ci',
  default_locale: 'en-US',
  default_models: null,
  default_prompt_suggestions: [
    { title: ['Explain a concept', 'in simple terms'], content: 'Explain this concept in simple terms.' },
    { title: ['Work with a document', 'using its context'], content: 'Use the attached document as context.' }
  ],
  features: {
    auth: true,
    auth_trusted_header: false,
    enable_signup: true,
    enable_web_search: false,
    enable_image_generation: false,
    enable_community_sharing: false,
    enable_message_rating: false,
    enable_admin_export: false
  },
  oauth: { providers: {} }
};

const demoUser = {
  id: 'portfolio-demo-user',
  email: 'faris@example.com',
  name: 'Faris',
  role: 'user',
  profile_image_url: '/static/favicon.png',
  last_active_at: Math.floor(Date.now() / 1000),
  created_at: Math.floor(Date.now() / 1000)
};

const demoModels = {
  data: [
    {
      id: 'askin-assistant',
      name: 'AskIn Assistant',
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'AskIn',
      info: { meta: { position: 0 } }
    }
  ]
};

const json = (res, body, status = 200) => {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-credentials': 'true',
    'access-control-allow-headers': 'authorization, content-type',
    'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(body));
};

const staticContentType = (path) => {
  switch (extname(path)) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    case '.css': return 'text/css';
    case '.js': return 'text/javascript';
    default: return 'application/octet-stream';
  }
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${host}:${port}`);
  const path = url.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
      'access-control-allow-headers': 'authorization, content-type',
      'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    });
    return res.end();
  }

  if (path === '/health') return json(res, { status: true });
  if (path === '/api/config') return json(res, config);
  if (path === '/api/models') return json(res, demoModels);
  if (path === '/api/v1/auths/' || path === '/api/v1/auths') return json(res, demoUser);

  if (path.includes('/users/user/settings')) return json(res, { ui: { theme: 'light' } });

  if (path.startsWith('/static/')) {
    try {
      const relativePath = normalize(path.replace(/^\/static\//, ''));
      if (relativePath.startsWith('..')) throw new Error('invalid static path');
      const file = await readFile(join(process.cwd(), 'backend', 'static', relativePath));
      res.writeHead(200, {
        'content-type': staticContentType(relativePath),
        'access-control-allow-origin': '*'
      });
      return res.end(file);
    } catch {
      return json(res, { detail: 'Not found' }, 404);
    }
  }

  // The screenshot environment intentionally returns empty collections for
  // user-specific data. It exercises the real AskIn frontend without needing
  // production credentials, databases, or model providers.
  if (path.startsWith('/api/v1/') || path.startsWith('/api/')) {
    if (req.method === 'GET') return json(res, []);
    return json(res, {});
  }

  return json(res, { detail: 'Not found' }, 404);
});

server.listen(port, host, () => {
  console.log(`Portfolio mock backend listening on http://${host}:${port}`);
});
