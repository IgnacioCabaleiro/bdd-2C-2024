const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const client = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: 'elastic',
    password: '123456'
  }
});

async function createIndex() {
  try {
    await client.indices.create({
      index: process.env.ELASTIC_INDEX || 'products',
      body: {
        mappings: {
          properties: {
            name: { type: 'text' },
            description: { type: 'text' },
            price: { type: 'float' },
            created_at: { type: 'date' }
          }
        }
      }
    });
    console.log('Index created successfully');
  } catch (error) {
    if (error.message.includes('resource_already_exists_exception')) {
      console.log('Index already exists');
    } else {
      console.error('Error creating index:', error);
    }
  }
}

createIndex();
module.exports = client;