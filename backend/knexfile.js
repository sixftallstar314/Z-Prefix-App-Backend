module.exports = {
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'admin',
        password: 'password', 
        database: 'inventory_manager',
        port: 5432
    },
    migrations : {
        tableName: 'knex_migrations'
    },
}