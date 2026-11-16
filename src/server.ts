import { app } from './app';
import { initializeDatabase } from './config/database';

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  try {
    await initializeDatabase();
    console.log('Conectado ao PostgreSQL e tabela "users" verificada.');
  } catch (error) {
    console.warn(
      'Aviso: Não foi possível conectar ao PostgreSQL na inicialização. Verifique se o container Docker está rodando ("npm run db:up").'
    );
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Métricas Prometheus disponíveis em http://localhost:${PORT}/metrics`);
  });
}

bootstrap();
