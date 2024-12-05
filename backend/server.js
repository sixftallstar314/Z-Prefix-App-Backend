const express = require('express');
const bodyParser = require ('body-parser');
const cookieParser = require('cookie-parser');
const knex = require ('knex')('./knexfile');
const cors = require ('cors');


const app= express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

const session = {};

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
            table.string('name').notNullable();
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
            return res.send('Invalid username or password');
        }
        const sessionId = new Date().getTime();
        session[sessionId] = {userId: user.id};
        res.cookie('session_id' , sessionId);
        res.send('Login successful');
    });
});

app.use ((req, res, next) => {
    const sessionId = req.cookies['session_id'];
    if (session[sessionId]) {
        req.session = session[sessionId];
        next();
    } else {
        res.send('Failed to login')
    }
});

app.get('/items', (reg, res) => {
    const userId = req.session.userId;

    knex('items')
    .select('*')
    .then((items)=> res.json(items))
});

app.post('/items', (req, res) => {
    const{name, description, quantity} = req.body;
    const userId = req.session.userId;

    knex('items')
    .insert({ name, description, quantity, user_id: userId })
    .returning('*')
    .then((item) => res.json(item[0]))
});

app.delete('/items/:id', (req, res) => {
    const id = req.params.id;
    const userId = req.session.userId;

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