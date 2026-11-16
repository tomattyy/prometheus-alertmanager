import { Request, Response, NextFunction } from 'express';
import client from 'prom-client';

export const register = new client.Registry();

register.setDefaultLabels({
  app: 'crud-service-pattern-postgres',
});

client.collectDefaultMetrics({ register });

export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP recebidas',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

export const httpActiveRequests = new client.Gauge({
  name: 'http_active_requests',
  help: 'Número de requisições HTTP em andamento',
  registers: [register],
});

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.path === '/metrics') {
    next();
    return;
  }

  httpActiveRequests.inc();
  const endTimer = httpRequestDurationSeconds.startTimer();

  res.on('finish', () => {
    const route = req.route?.path
      ? `${req.baseUrl || ''}${req.route.path}`
      : req.path;

    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);
    endTimer(labels);
    httpActiveRequests.dec();
  });

  next();
}

export async function metricsEndpoint(_req: Request, res: Response): Promise<void> {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
}

