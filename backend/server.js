const express = require('express');
const bodyParser = require ('body-parser');
const cors = require('cors')
const knex = require ('knex')(require('./knexfile.js'));
const app = express(); 
const PORT = 3001;
const bcrypt = require('bcrypt')

app.use(bodyParser.json());
app.use(cors())
app.use(express.static('backend/public'));

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

app.get('/', (req, res) => {
    res.send('Welcome to the Inventory App API')
})

app.post('/register', (req, res) => {
    const { username, password } =req.body;

    knex('users')
        .where({username})
        .first()
        .then((user) => {
            if (user) {
                return res.json({ message: 'username already exists'});
            }
    bcrypt.hash(password, 10, (error, hash) => {
        if (error) {
            return res.json({message:'hashing error'})
        }
    knex('users')
    .insert({ username, password: hash })
    .returning('id')
    .then((id) => res.json({ id: id[0] }));
        });
    });
});

app.post('/login', (req, res) => {
    const {username, password } =req.body

    knex('users')
    .select('*')
    .where({ username})
    .first ()
    .then ((user) => {
        if (!user) {
            return res.json({message: 'Invalid username or password'});
        }
        bcrypt.compare(password, user.password, (error, result) => {
            if (error || !result) {
                return res.json({message: 'Invalid username or password'})
            }
            res.json({ message: 'login good'});
        });
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

app.put('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const { name, description, quantity } = req.body;

    knex('items')
    .where({ id: itemId })
    .update({ name, description, quantity })
    .returning('*')
    .then((updatedItem) => {
        if (updatedItem.length) {
            res.json(updatedItem[0]);
        } else {
            res.json({ message: 'Item not found' });
        }
    })
    .catch((error) => res.json({ error: 'Failed to update item', details: error }));
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