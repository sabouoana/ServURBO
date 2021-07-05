const { Pool } = require('pg');


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'koa_api_test',
    password: 'licenta',
    port: 5432
});

async function executeQuery(query) {
    let dbClient;
    try {
        dbClient = await pool.connect();
        return (await dbClient.query(query)).rows;
    } catch (e) {
        console.error(`DB error: ${e.message || e}`);
        return [];
    } finally {
        if (dbClient) {
            dbClient.release();
        }
    }
}

module.exports = {
    executeQuery,
    pool
}