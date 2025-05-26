const express = require('express');
const amqp = require('amqplib');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public')); // Serve static files (HTML, JS, CSS)

// Endpoint to send messages to RabbitMQ
app.post('/send', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();
    const queue = 'myQueue';
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(message));
    console.log('Sõnum saadetud:', message);

    // Close the channel and connection
    await channel.close();
    await conn.close();

    res.json({ status: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
