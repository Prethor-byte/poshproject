import { Request, Response, NextFunction } from 'express';
import { getNextProxy } from '../config/proxy';
import type { PoshmarkRegion } from '../types/poshmark';
import HttpsProxyAgent from 'https-proxy-agent';
import { URL } from 'url';

// Custom error for proxy-related issues
export class ProxyError extends Error {
  constructor(message: string, public readonly details?: any) {
    super(message);
    this.name = 'ProxyError';
  }
}

// Get proxy agent for a specific region
export function getProxyAgent(region: PoshmarkRegion) {
  const proxy = getNextProxy(region);
  if (!proxy) {
    throw new ProxyError(`No proxy available for region: ${region}`);
  }

  const proxyUrl = new URL(`http://${proxy.hostname}:${proxy.port}`);
  if (proxy.auth) {
    proxyUrl.username = proxy.auth.username;
    proxyUrl.password = proxy.auth.password;
  }

  return new HttpsProxyAgent(proxyUrl.toString());
}

// Middleware to attach proxy to requests
export function attachProxy(req: Request, res: Response, next: NextFunction) {
  const region = req.body?.region as PoshmarkRegion;
  
  if (!region) {
    return next(new ProxyError('Region not specified in request'));
  }

  try {
    const agent = getProxyAgent(region);
    (req as any).proxyAgent = agent;
    next();
  } catch (error) {
    next(error);
  }
}

// Error handler middleware for proxy errors
export function handleProxyError(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ProxyError) {
    res.status(502).json({
      error: 'Proxy Error',
      message: error.message,
      details: error.details
    });
  } else {
    next(error);
  }
}

// Middleware to validate region
export function validateRegion(req: Request, res: Response, next: NextFunction) {
  const region = req.body?.region as PoshmarkRegion;
  
  if (!region) {
    return res.status(400).json({
      error: 'Missing Region',
      message: 'Region must be specified in the request body'
    });
  }

  if (!['US', 'CA'].includes(region)) {
    return res.status(400).json({
      error: 'Invalid Region',
      message: 'Region must be either "US" or "CA"'
    });
  }

  next();
}
