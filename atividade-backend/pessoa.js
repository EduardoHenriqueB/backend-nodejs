require('dotenv').config();
const db = require('./db');

class Pessoa {
  constructor(nome, idade, cep, cpf) {
    this.nome = nome;
    this.idade = idade;
    this.cep = cep;
    this.cpf = cpf;
  }

  static async getAll() {
    return db.many('SELECT * FROM pessoas');
  }

  static async create(nome, idade, cep, cpf) {
    return db.one('INSERT INTO pessoas (nome, idade, cep, cpf) VALUES ($1, $2, $3, $4) RETURNING *', [nome, idade, cep, cpf])
      .then(data => new Pessoa(data.nome, data.idade, data.cep, data.cpf));
  }

  static async getByCpf(cpf) {
    return db.one('SELECT * FROM pessoas WHERE cpf = $1', cpf)
      .then(data => new Pessoa(data.nome, data.idade, data.cep, data.cpf));
  }

  static async updateByCpf(cpf, nome, idade, cep) {
    return db.one('UPDATE pessoas SET nome = $1, idade = $2, cep = $3 WHERE cpf = $4 RETURNING *', [nome, idade, cep, cpf])
      .then(data => new Pessoa(data.nome, data.idade, data.cep, data.cpf));
  }

  static async deleteByCpf(cpf) {
    return db.none('DELETE FROM pessoas WHERE cpf = $1', cpf);
  }
}

module.exports = Pessoa;