const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const port = 3000;
app.use(cors()); // Enable CORS for all routes


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smile_drinking_water',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});




app.get('/products', (req, res) => {
  const query = 'SELECT * FROM products';

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error executing the query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(result)
  })
})


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});