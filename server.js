const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/products');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(logger);

app.get('/', (req, res) => res.send('Hello World'));
app.use('/api/products', productRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
