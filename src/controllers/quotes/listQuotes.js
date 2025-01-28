
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');
const quotesFilePath = path.join(__dirname, 'quotes.json');

fs.access(quotesFilePath)
  .catch(() => fs.writeFile(quotesFilePath, '[]'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

export default async function listQuotes(req, res) {
    
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
  };