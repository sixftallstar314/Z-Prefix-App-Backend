const express = require('express');
const bodyParser = require ('body-parser');
const session = require('express-session');
const connectKnexSession = require('connect-session-knex')(session);
const cors = require('cors');
const knexConfig = require('./knexfile.js');
const knex = require ('knex')(knexConfig)

const app = express(); 
const PORT = 3001;

const store = new connectKnexSession({
    knex: knex,
    tablename: 'sessions',
});

app.use(KnexSession({
    secret: '20755',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(cors());
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
            table.integer('user_id').references('id').inTable('users');
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
        req.session.user = {id: user.id, username: user.username };
        res.send('Login Good')
    });
});

app.get('/items', (reg, res) => {
    const userId = req.user.id;

    knex('items')
    .select('*')
    .then((items)=> res.json(items))
});

app.post('/items', (req, res) => {
    const{name, description, quantity} = req.body;
    const userId = req.user.id;

    knex('items')
    .insert({ name, description, quantity})
    .returning('*')
    .then((item) => res.json(item[0]))
});

app.delete('/items/:id', (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;

    knex('items')
    .where({ id, user_id: userId })
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