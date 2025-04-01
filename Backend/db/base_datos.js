import 'dotenv/config'
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    port: process.env.PUERTO_BBDD,
    host: process.env.HOST,
    database: process.env.BASE_DATOS,
    user: process.env.USUARIO,
    password: process.env.PASSWORD
});

export default pool;