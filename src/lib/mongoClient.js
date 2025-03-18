import { MongoClient, ServerApiVersion } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
};

if (!MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

let client;
let mongoClientPromise;

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClient) {
        global._mongoClient = new MongoClient(MONGODB_URI, options);
        mongoClientPromise = global._mongoClient.connect();
    }
    client = global._mongoClient;
} else {
    client = new MongoClient(MONGODB_URI, options);
    mongoClientPromise = client.connect();
}

export { client, mongoClientPromise };
