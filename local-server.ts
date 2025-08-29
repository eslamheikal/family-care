import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3000;

// Middleware to parse JSON request bodies
app.use(cors());
app.use(express.json());

// --- Dynamic API Route Loader ---
const apiDirectory = path.join(__dirname, 'api/endpoints');

// Check if the api directory exists
if (fs.existsSync(apiDirectory)) {
  fs.readdirSync(apiDirectory).forEach(file => {
    // We only want to register .ts files as routes
    if (file.endsWith('.ts')) {
      const routeName = file.replace('.ts', '');
      const routePath = `/api/${routeName}`;
      const modulePath = path.join(apiDirectory, file);

      // Use app.all() to handle any HTTP method (GET, POST, etc.)
      app.all(routePath, (req: Request, res: Response) => {
        try {
          // Dynamically require the module
          const handler = require(modulePath).default;
          if (typeof handler === 'function') {
            // Execute the Vercel-compatible function
            handler(req, res);
          } else {
            res.status(500).send(`Error: No default export found in ${file}`);
          }
        } catch (error) {
          console.error(`Error handling request for ${routePath}:`, error);
          res.status(500).send('Internal Server Error');
        }
      });

      console.log(`✔️  Mapped route ${routePath} to ${file}`);
    }
  });
} else {
  console.warn('⚠️  `api` directory not found. No API routes loaded.');
}

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Family Care Local Development Server',
    version: '1.0.0',
    note: 'This server dynamically loads serverless endpoints from the api/ directory',
    endpoints: {
      health: '/api/health',
      family: '/api/family'
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n🚀 Local Express server is running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Family: http://localhost:${PORT}/api/family`);
  console.log(`🏠 Root: http://localhost:${PORT}/`);
  console.log(`📝 Dynamic API routes loaded from api/ directory`);
});