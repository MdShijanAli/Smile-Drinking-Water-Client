const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json()); 
const mysql = require('mysql');
const port = process.env.PORT || 3030;
app.use(cors()); // Enable CORS for all routes

require('dotenv').config();



/* const connection = mysql.createConnection({
  host: 'localhost',
  user: 'zealtechweb_smile_drinking_water',
  password: 'smile_drinking_water',
  database: 'zealtechweb_smile_drinking_water',
}); */
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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


app.get('/api/infos', (req, res) => {
  const query = 'SELECT * FROM website_info';

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error executing the query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(result)
  })
})

app.get('/api/orders', (req, res) => {
  const query = 'SELECT * FROM orders ORDER BY date DESC';

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error executing the query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(result)
    res.send(result)
  })
})


// API endpoint to insert product data
app.post('/api/products', (req, res) => {
  const { img, title, description, code } = req.body;
  console.log('Received request with data:', req.body);

  const query = 'INSERT INTO products (img, title, description, code) VALUES (?, ?, ?, ?)';
  const values = [img, title, description, code];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting product:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Product inserted successfully');
    res.status(201).send('Product inserted successfully');
  });
});

app.post('/api/order', (req, res) => {
  const { firstName, lastName, email, phone, fullAddress, service, division, district, upazila, unionn } = req.body;
  console.log("Order Data", req.body);

  const query = 'INSERT INTO orders (firstName, lastName, email, phone, fullAddress, service, division, district, upazila, unionn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [firstName, lastName, email, phone, fullAddress, service, division, district, upazila, unionn];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting Orders:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Orders Insert successfully');
    res.status(201).send('Orders Inserted successfully')
  })
})

// POst Applications

app.post('/api/application', (req, res) => {
  const { firstName, lastName, email, phone, fullAddress, division, district, upazila, unionn, cv, jobTitle } = req.body;
  const query = 'INSERT INTO applications (firstName, lastName, email, phone, fullAddress, division, district, upazila, unionn, cv, jobTitle) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [firstName, lastName, email, phone, fullAddress, division, district, upazila, unionn, cv, jobTitle];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error Inserting Application', err);
      res.status(500).send('Internal Server Irror');
      return;
    }
    console.log('Application Intert Successfull')
    res.status(201).send('Applicaiton Inserted Sucsessfully')
  })
})

// Get aspplications Data

app.get('/api/applications', (req, res) => {
  const query = 'SELECT * from applications';

  connection.query(query, (err, result) => {
    if (err) {
      console.log('Error Getting Application', err);
      res.status(201).send('Applications Not Get');
      return;
    }
    console.log('Applications Fetch Successfully');
    res.json(result);
  })
})


app.post('/api/job', (req, res) => {
  const { title, description, location, jobType, vacancy, applyLastDate} = req.body;
  const query = 'INSERT INTO jobs (title, description, location, jobType, vacancy, applyLastDate) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [title, description, location, jobType, vacancy, applyLastDate];

  connection.query(query, values, (err, result)=> {
    if(err) {
      console.error('Error inserting Jobs:', err);
      res.status(500).send('Error inserting Jobs')
      return;
    }
    console.log('Jobs Inserted Succesfully')
    res.status(201).send('Job Inserted Successfully')
  })
})

app.get('/api/jobs', (req, res) => {
  const query = 'SELECT * from jobs ORDER BY jobPostTime DESC';

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error Gitting Jobs:', err);
      res.status(201).send('Job Gets Error')
      return;
    }
    console.log('Jobs Fetch Succesfully')
    res.json(result)
  })
})



// Delete product route
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  const query = 'DELETE FROM products WHERE id = ?';

  connection.query(query, [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Product deleted successfully');
    res.status(200).send('Product deleted successfully');
  });
});


// Delete Job route
app.delete('/api/job/:id', (req, res) => {
  const jobId = req.params.id;

  const query = 'DELETE FROM jobs WHERE id = ?';

  connection.query(query, [jobId], (err, result) => {
    if (err) {
      console.error('Error deleting Job:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Job deleted successfully');
    res.status(200).send('Job deleted successfully');
  });
});




// Update Product API
app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const { title, description } = req.body;
  console.log('Received request with data:', req.body);

  const query = 'UPDATE products SET title = ?, description = ? WHERE id = ?';
  const values = [title, description, productId];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Product updated successfully');
    res.status(200).send('Product updated successfully');
  });
});

app.put('/api/job/:id', (req, res) => {
  const jobId = req.params.id;
  const { title, location, jobType, vacancy, applyLastDate, description } = req.body;
  const query = 'UPDATE jobs SET title = ?, location = ?, jobType = ?, vacancy = ?, applyLastDate = ?, description = ? WHERE id = ?';
  const values = [title, location, jobType, vacancy, applyLastDate, description, jobId];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating Jobs:', err);
    res.status(500).send('Internal Server Error');
    return;
    }
    console.log('Job updated successfully');
    res.status(200).send('Job updated successfully');
  })

})



// Update Website Info API
app.put('/api/update/:id', (req, res) => {
  const websiteId = req.params.id;
  const websiteDetails = req.body;

  const updateQuery = `
    UPDATE website_info
    SET
      name = ?,
      email = ?,
      facebook = ?,
      twitter = ?,
      linkedin = ?,
      img = ?,
      websiteName = ?,
      websiteAddress = ?,
      telephone = ?,
      phone = ?,
      logoImg = ?,
      logoWhiteImg = ?
    WHERE id = ?`;

  connection.query(updateQuery, [
    websiteDetails.name,
    websiteDetails.email,
    websiteDetails.facebook,
    websiteDetails.twitter,
    websiteDetails.linkedin,
    websiteDetails.photo,
    websiteDetails.websitename,
    websiteDetails.websiteaddress,
    websiteDetails.telephone,
    websiteDetails.phone,
    websiteDetails.logo,
    websiteDetails.logoWhite,
    websiteId,
  ], (err, results) => {
    if (err) {
      console.error('Error updating website details:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.affectedRows > 0) {
      res.status(200).json({ message: 'Website details updated successfully' });
    } else {
      res.status(404).json({ message: 'Website not found' });
    }
  });
});



app.get('/', (req, res) => {
  res.send('Smile Drinking Water Website Server Api Running')
})


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});