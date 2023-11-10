require('dotenv').config(); // Adicione esta linha para carregar as variáveis de ambiente do arquivo .env

const pgp = require('pg-promise')();

const connectionString = process.env.DATABASE_URL; // A URL do banco de dados deve ser configurada nas variáveis de ambiente

const db = pgp(connectionString);

module.exports = db;
