const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'ep-dry-dust-85999105-pooler.ap-southeast-1.postgres.vercel-storage.com'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'verceldb'),
      user: env('DATABASE_USERNAME', 'default'),
      password: env('DATABASE_PASSWORD', 'hpaMcE3XZ9OF'),
      schema: env('DATABASE_SCHEMA', 'public'), // Not required
      ssl: {
        rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
      },
    },
    debug: false,
  },
});
