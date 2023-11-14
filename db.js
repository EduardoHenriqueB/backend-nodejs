require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const pgp = require('pg-promise')();

const connectionString = process.env.DATABASE_URL; // A URL do banco de dados deve ser configurada nas variáveis de ambiente

const db = pgp(connectionString);

// Script SQL para criar a tabela funcionarios
const createFuncionariosTable = `
  CREATE TABLE IF NOT EXISTS funcionarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    idade INTEGER NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    cargo VARCHAR(255),
    departamento VARCHAR(255)
  );
`;

// Execute o script SQL para criar a tabela
db.none(createFuncionariosTable)
  .then(() => {
    console.log('Tabela funcionarios criada com sucesso.');
  })
  .catch((error) => {
    console.error('Erro ao criar a tabela funcionarios:', error);
  });

// Exporta a instância do banco de dados para ser utilizado em outras partes do aplicativo
module.exports = db;
