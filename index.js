const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { QueryResultError } = require('pg-promise');
const pgp = require('pg-promise')();

const port = process.env.PORT || 3000;

const Funcionario = require('./funcionario');

app.use(bodyParser.json());

// GETALL FUNCIONARIOS
app.get('/funcionarios', async (req, res) => {
  try {
    const funcionarios = await Funcionario.getAll();
    res.setHeader('Content-Type', 'application/json');
    res.json(funcionarios);
  } catch (error) {
    if (error.code === pgp.errors.queryResultErrorCode.noData) {
      res.setHeader('Content-Type', 'application/json');
      res.json([]);
    } else {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar os funcionários' });
    }
  }
});

// CREATE FUNCIONARIO
app.post('/funcionarios', async (req, res) => {
  try {
    const { nome, idade, cpf, cargo, departamento } = req.body;
    const newFuncionario = await Funcionario.create(nome, idade, cpf, cargo, departamento);
    res.json(newFuncionario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o funcionário' });
  }
});

// GET FUNCIONARIO VIA CPF
app.get('/funcionarios/:cpf', async (req, res) => {
  try {
    const cpf = req.params.cpf;
    const funcionario = await Funcionario.getByCpf(cpf);
    if (funcionario) {
      res.json(funcionario);
    } else {
      res.status(404).json({ error: 'Funcionário não encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar o funcionário' });
  }
});

// UPDATE FUNCIONARIO VIA CPF
app.put('/funcionarios/:cpf', async (req, res) => {
  try {
    const cpf = req.params.cpf;
    const { nome, idade, cargo, departamento } = req.body;
    const updatedFuncionario = await Funcionario.updateByCpf(cpf, nome, idade, cargo, departamento);
    res.json(updatedFuncionario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o funcionário' });
  }
});

// DELETE FUNCIONARIO VIA CPF
app.delete('/funcionarios/:cpf', async (req, res) => {
  try {
    const cpf = req.params.cpf;
    await Funcionario.deleteByCpf(cpf);
    res.json({ message: 'Funcionário excluído com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir o funcionário' });
  }
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
