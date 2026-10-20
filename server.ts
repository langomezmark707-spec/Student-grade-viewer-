import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.log('⚠️ dist/index.html not found! Running build automatically on Render...');
  try {
    const isBun = typeof process.versions.bun !== 'undefined' || fs.existsSync(path.join(__dirname, 'bun.lock'));
    const buildCmd = isBun ? 'bun run build' : 'npm run build';
    console.log(`Executing: ${buildCmd}`);
    execSync(buildCmd, { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Auto-build completed successfully!');
  } catch (err) {
    console.error('❌ Build failed during startup:', err);
  }
}

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

app.get('*', (_req: Request, res: Response) => {
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(503).send('Building application...');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Production server running on http://0.0.0.0:${PORT}`);
});
