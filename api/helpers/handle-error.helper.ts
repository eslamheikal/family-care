import { Request, Response } from 'express';

export function handleError(res: Response, error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Handle specific error types
    if (errorMessage.includes('Cannot find module') || errorMessage.includes('firebase')) {
      return res.status(500).json({ 
        error: 'Database configuration error',
        message: 'Firebase service account key not found or invalid. Please check your configuration.'
      });
    }
    
    if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
      return res.status(403).json({ 
        error: 'Database access denied',
        message: 'Insufficient permissions to access the database.'
      });
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
      return res.status(503).json({ 
        error: 'Database connection timeout',
        message: 'Unable to connect to the database. Please try again later.'
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: errorMessage
    });
  }