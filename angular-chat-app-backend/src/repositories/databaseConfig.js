const dotenv = require('dotenv')
const mysql = require('mysql')

dotenv.config()

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASSWORD,
    database        : process.env.DB_DATABASE,
    dateStrings     : 'date'
})

const query = (sqlQuery, values) => {
    return new Promise((resolve, reject) => {
        pool.query(sqlQuery, values, (error, result) => {
            if (error) {
                console.error(error)
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

module.exports = { query }