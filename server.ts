import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.join(__dirname, 'dist');

app.use(express.static(distPath));

app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Production server running on http://0.0.0.0:${PORT}`);
});
