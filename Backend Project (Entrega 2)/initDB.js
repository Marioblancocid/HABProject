require('dotenv').config();
const fs = require('fs');

const { getConnection } = require('./db');

async function processSQLFile(fileName) {
  try {
    // Extract SQL queries from files. Assumes no ';' in the fileNames
  const connection = await getConnection();
  await connection.query('DROP TABLE IF EXISTS ratings');
  await connection.query('DROP TABLE IF EXISTS users_meetings');
  await connection.query('DROP TABLE IF EXISTS languages_meetings');
  await connection.query('DROP TABLE IF EXISTS users_languages');
  await connection.query('DROP TABLE IF EXISTS languages');
  await connection.query('DROP TABLE IF EXISTS meetings');
  await connection.query('DROP TABLE IF EXISTS users');

  console.log('Dropped all tables');

  var queries = fs
    .readFileSync(fileName)
    .toString()
    .replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
    .replace(/\s+/g, ' ') // excess white space
    .split(';') // split into all statements
    .map(Function.prototype.call, String.prototype.trim)
    .filter(function (el) {
      return el.length != 0;
    }); // remove any empty ones
    console.log(`Importing Random Data: 500 users, 135 languages, 300 meetings, 500 user-languages inserts, 300 language-meetings inserts, 500 user-meetings inputs and 500 ratings`);
    console.log(`This can take a few minutes, please wait...`);
    // Execute each SQL query sequentially
  for (const query of queries) {
    await connection.query(query);
  }
  connection.release();
  } catch (error) {
    console.log(error);
  }
  console.log('Data created and imported');
  process.exit();
}

processSQLFile('initialrandomdata.sql');