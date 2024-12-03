module.exports = {
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'user',
        password: 'password', 
        database: 'inventory_manager'
    },
    migrations : {
        tableName: 'knex_migrations'
    },
};