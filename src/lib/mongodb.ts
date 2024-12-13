import { MongoClient } from 'mongodb';

const uri: string = process.env.MONGO_URI || '';
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so the MongoClient is not repeatedly instantiated
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's a new client for each connection
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
