import express from 'express';
import cors from 'cors';
import { userRoutes } from './routes/user.routes';
import { errorHandler } from './middlewares/error.middleware';
import { metricsMiddleware, metricsEndpoint } from './middlewares/metrics.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/metrics', metricsEndpoint);

app.post('/api/alerts/webhook', (req, res) => {
  const { status, alerts } = req.body || {};
  console.log(`[Alertmanager Webhook] Status: ${status ?? 'unknown'} | Alertas recebidos: ${alerts?.length ?? 0}`);
  if (Array.isArray(alerts)) {
    for (const alert of alerts) {
      console.log(
        ` -> [${alert.status?.toUpperCase()}] ${alert.labels?.alertname} (${alert.labels?.severity}): ${alert.annotations?.summary}`
      );
    }
  }
  res.status(200).json({ received: true });
});

app.use('/api/users', userRoutes);

app.use(errorHandler);

export { app };
