const express = require('express');
const bodyParser = require ('body-parser');
const knex = require ('knex')(require('./knexfile'));

const app = express(); 
const PORT = 5000;

app.use(bodyParser.json());

knex.schema.hasTable('users').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('users' , (table) => {
            table.increments('id').primary();
            table.string('username').unique().notNullable();
            table.string('password').notNullable();
        });
    }
});

knex.schema.hasTable('items').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('items', (table)=> {
            table.increments('id').primary();
            table.string('name').notNullable
            table.text('description');
            table.integer('quantity').defaultTo(0);
        });
    }
});

app.post('/register', (req, res) => {
    const { username, password } =req.body;

    knex('users')
    .insert({ username, password })
    .returning('id')
    .then((id) => res.json({ id: id[0] }));
});

app.post('/login', (req, res) => {
    const {username, password } =req.body

    knex('users')
    .select('*')
    .where({ username})
    .first ()
    .then ((user) => {
        if (!user || user.password !== password) {
            return res.send();
        }
        res.json({ message: 'login good'});
    });
});

app.get('/items', (reg, res) => {
    knex('items')
    .select('*')
    .then((items)=> res.json(items))
});

app.post('/items', (req, res) => {
    const{name, description, quantity} = req.body;

    knex('items')
    .insert({ name, description, quantity})
    .returning('*')
    .then((item) => res.json(item[0]))
});

app.delete('/items/:id', (req, res) => {
    const id = req.params.id;

    knex('items')
    .where({ id })
    .del()
    .then((count) => {
        if (count === 0) {
            return res.send();
    }
    res.send();
});
});


app.listen(PORT, () => {
    console.log('Server works')
});