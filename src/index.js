const express = require('express');
const { uuid, isUuid } = require('uuidv4');
const app = express();

app.use(express.json());

/**
 * vamos usar esta variavel para armazenar qualquer dados, para usar de teste.
 * Ao atualizar o codigo, essa variavel que continha valores, sera reiniciada sem nenhum valor. Depois usaremos
 * um banco de dados para melhor evolucao. jamais use essa variavel em producao.
 * 👇🏻.
 */

const database = [];

function logRequests(request, response, next) {
    const {method, url} = request;
    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);
    next();
    console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
    const {id} = request.params;

    if(!isUuid(id)){
        return response.status(400).json({error: 'Invalid project ID.'});
    }
    return next();
}
app.use(logRequests);
app.use('/Home/:id', validateProjectId);


app.get('/Home', (request, response) => {
    const {title} = request.query;
    const results = title

    ? database.filter(use => use.title.includes(title))
    : database;

    return response.json(results);
});

app.post('/Home', (request, response) => {
    const {title, owner, email, pedido} = request.body;
    const user = {id: uuid(), title, owner, email, pedido};
    database.push(user);

    console.log(user);
    return response.json(user);
});

app.put('/Home/:id', (request, response) => {
    const {id} = request.params;
    const {title, owner, email, pedido} = request.body;
    const userUnic = database.findIndex(user => user.id == id);

    if(userUnic < 0){
        return response.status(400).json({error:'User not found.'})
    }

    const user = {
        id,
        title,
        owner,
        email,
        pedido,
    }

    console.log('um usuario foi atualizado ', user);
    return response.json(user);
});

app.delete('/Home/:id', (request, response) => {
    const {id} = request.params;
    const userUnic = database.findIndex(user => user.id == id);

    if(userUnic < 0){
        return response.status(400).json({error:'User not found.'})
    }

    database.splice(userUnic, 1);
    return response.status(204).send();
});

app.listen(3333, () => {
    console.log('⛳️ Back-end started!');
});