const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { QueryResultError } = require('pg-promise');
const pgp = require('pg-promise')();

const port = process.env.PORT || 3000; // Porta que a API irá ouvir (ou usa a porta definida nas variáveis de ambiente)

// Importe o modelo Task
const Task = require('./task');
// Importe o modelo Pessoa
const Pessoa = require('./pessoa'); // Certifique-se de usar o caminho correto para o arquivo Pessoa.js

app.use(bodyParser.json());

// Rota para listar todas as tarefas
app.get('/tasks', async (req, res) => {
    try {
      const tasks = await Task.getAll(); // Adicione 'await' aqui
      res.setHeader('Content-Type', 'application/json');
      res.json(tasks);
    } catch (error) {
      if (error.code === pgp.errors.queryResultErrorCode.noData) {
        res.setHeader('Content-Type', 'application/json');
        res.json([]);
      } else {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar as tarefas' });
      }
    }
  });

// Rota para listar todas as pessoas
app.get('/pessoas', async (req, res) => {
    try {
      const pessoas = await Pessoa.getAll(); // Adicione 'await' aqui
      res.setHeader('Content-Type', 'application/json');
      res.json(pessoas);
    } catch (error) {
      if (error.code === pgp.errors.queryResultErrorCode.noData) {
        res.setHeader('Content-Type', 'application/json');
        res.json([]);
      } else {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar as pessoas' });
      }
    }
  });

// Rota para criar uma tarefa
app.post('/tasks', async (req, res) => {
  try {
    const { titulo, descricao, done } = req.body;
    const newTask = await Task.create(titulo, descricao, done);
    res.json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar a tarefa' });
  }
});

// Rota para criar uma pessoa
app.post('/pessoas', async (req, res) => {
  try {
    const { nome, idade, cep, cpf } = req.body;
    const newPessoa = await Pessoa.create(nome, idade, cep, cpf);
    res.json(newPessoa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar a pessoa' });
  }
});

// Rota para buscar uma tarefa por ID
app.get('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.getById(taskId);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar a tarefa' });
  }
});

// Rota para buscar uma pessoa por CPF
app.get('/pessoas/:cpf', async (req, res) => {
  try {
    const cpf = req.params.cpf;
    const pessoa = await Pessoa.getByCpf(cpf);
    if (pessoa) {
      res.json(pessoa);
    } else {
      res.status(404).json({ error: 'Pessoa não encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar a pessoa' });
  }
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
