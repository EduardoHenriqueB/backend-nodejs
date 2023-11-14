const db = require('./db');

class Funcionario {
  constructor(nome, idade, cpf, cargo, departamento) {
    this.nome = nome;
    this.idade = idade;
    this.cpf = cpf;
    this.cargo = cargo;
    this.departamento = departamento;
  }

  static async getAll() {
    return db.many('SELECT * FROM funcionarios');
  }

  static async create(nome, idade, cpf, cargo, departamento) {
    return db.one('INSERT INTO funcionarios (nome, idade, cpf, cargo, departamento) VALUES ($1, $2, $3, $4, $5) RETURNING *', [nome, idade, cpf, cargo, departamento])
      .then(data => new Funcionario(data.nome, data.idade, data.cpf, data.cargo, data.departamento));
  }

  static async getByCpf(cpf) {
    return db.one('SELECT * FROM funcionarios WHERE cpf = $1', cpf)
      .then(data => new Funcionario(data.nome, data.idade, data.cpf, data.cargo, data.departamento));
  }

  static async updateByCpf(cpf, nome, idade, cargo, departamento) {
    return db.one('UPDATE funcionarios SET nome = $1, idade = $2, cargo = $3, departamento = $4 WHERE cpf = $5 RETURNING *', [nome, idade, cargo, departamento, cpf])
      .then(data => new Funcionario(data.nome, data.idade, data.cpf, data.cargo, data.departamento));
  }

  static async deleteByCpf(cpf) {
    return db.none('DELETE FROM funcionarios WHERE cpf = $1', cpf);
  }
}

module.exports = Funcionario;
