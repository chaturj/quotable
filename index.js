const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors());

const quotesFilePath = path.join(__dirname, 'quotes.json');

const authorFilePath = path.join(__dirname, 'author.json');

const tagsFilePath = path.join(__dirname, 'tags.json');

// Create an empty quotes array if the file doesn't exist
fs.access(quotesFilePath)
  .catch(() => fs.writeFile(quotesFilePath, '[]'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

  fs.access(authorFilePath)
  .catch(() => fs.writeFile(authorFilePath, '[]'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

  fs.access(tagsFilePath)
  .catch(() => fs.writeFile(tagsFilePath, '[]'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('Welcome to the Quote API!');
});

app.get('/quote', async (req, res) => {
  try {
    // Read the quotes from the JSON file
    const data = await fs.readFile(quotesFilePath, 'utf8');
    const quotes = JSON.parse(data);

    const quotesArray = quotes['results']
    // Select a random quote
    //const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const page = parseInt(req.query.page, 10) || 1;
   const limit = parseInt(req.query.limit, 10) || 10;
  
    // Calculate start and end indexes
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    // Paginated items
    const paginatedItems = quotesArray.slice(startIndex, endIndex);
  
    // Total pages
    const totalPages = Math.ceil(quotesArray.length / limit);
  
    res.json({
      page,
      limit,
      totalItems: quotesArray.length,
      totalPages,
      items: paginatedItems,
    });
    // Return the quote as a JSON response
    //res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch a quote.' });
  }
});

app.get('/author', async (req, res) => {
  try {
    // Read the quotes from the JSON file
    const data = await fs.readFile(authorFilePath, 'utf8');
    const quotes = JSON.parse(data);

    const quotesArray = quotes['results']
    // Select a random quote
    //const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const page = parseInt(req.query.page, 10) || 1;
   const limit = parseInt(req.query.limit, 10) || 10;
  
    // Calculate start and end indexes
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    // Paginated items
    const paginatedItems = quotesArray.slice(startIndex, endIndex);
  
    // Total pages
    const totalPages = Math.ceil(quotesArray.length / limit);
  
    res.json({
      page,
      limit,
      totalItems: quotesArray.length,
      totalPages,
      items: paginatedItems,
    });
    // Return the quote as a JSON response
    //res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch a quote.' });
  }
});

app.get('/tags', async (req, res) => {
  try {
    // Read the quotes from the JSON file
    const data = await fs.readFile(tagsFilePath, 'utf8');
    const tags = JSON.parse(data);
    // Return the quote as a JSON response
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch a quote.' });
  }
});

app.post('/quote', async (req, res) => {
  try {
    // Extract the quote and author from the request body
    const { quote, author } = req.body;

    // Read the existing quotes from the JSON file
    const data = await fs.readFile(quotesFilePath, 'utf8');
    const quotes = JSON.parse(data);

    // Create a new quote object
    const newQuote = { quote, author };

    // Add the new quote to the quotes array
    quotes.push(newQuote);

    // Write the updated quotes array back to the JSON file
    await fs.writeFile(quotesFilePath, JSON.stringify(quotes));

    // Return the new quote as a JSON response
    res.json(newQuote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to add the quote.' });
  }
});

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Custom message for inspecting
server.on('listening', () => {
  console.log('Thanks for using this API');
});
