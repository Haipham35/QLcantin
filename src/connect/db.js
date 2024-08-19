const pg = require('pg');

const pool = new pg.Pool({
    user: 'haipham',
    host: 'localhost',
    database: 'qlcantin',
    password: '123456',
    port: 5432, 
});
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));
  
module.exports = {pool};