
import fs from 'node:fs/promises';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/meals', async (req, res) => {
  try {
    const meals = await fs.readFile('./data/available-meals.json', 'utf8');
    res.json(JSON.parse(meals));
  } catch (error) {
    console.error('Error reading meals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/orders', async (req, res) => {
  console.log('Incoming request body:', req.body);

  const orderData = req.body?.order;

  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ message: 'Missing data: Order or items are missing.' });
  }

  const { customer } = orderData;

  if (
    !customer.email ||
    !customer.email.includes('@') ||
    !customer.name ||
    customer.name.trim() === '' ||
    !customer.street ||
    customer.street.trim() === '' ||
    !customer['postal-code'] ||
    customer['postal-code'].trim() === '' ||
    !customer.city ||
    customer.city.trim() === ''
  ) {
    return res.status(400).json({
      message: 'Missing data: Email, name, street, postal code or city is missing.',
    });
  }

  try {
    const newOrder = {
      ...orderData,
      id: (Math.random() * 1000).toString(),
    };

    const orders = await fs.readFile('./data/orders.json', 'utf8');
    const allOrders = JSON.parse(orders);
    allOrders.push(newOrder);

    await fs.writeFile('./data/orders.json', JSON.stringify(allOrders));

    res.status(201).json({ message: 'Order created!', order: newOrder });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use((req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: 'Not found' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
