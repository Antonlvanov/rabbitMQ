const amqp = require('amqplib');

async function receive() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  const queue = 'myQueue';
  await channel.assertQueue(queue);
  channel.consume(queue, msg => {
    if (msg !== null) {
      console.log('Sõnum:', msg.content.toString());
      channel.ack(msg);
    }
  });
}

receive();
