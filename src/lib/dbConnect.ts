import mongoose, { ConnectOptions } from "mongoose";

type connectionObject = {
    isConnected?: number;
};

export const connection: connectionObject = {};

export const dbConnect = async () => {
    if (connection.isConnected) {
        console.log("MongoDB is already connected");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {
            dbName: 'feedback', // Add your actual database name here
        } as ConnectOptions);

        console.log(`db:`, db);
        connection.isConnected = db.connections[0].readyState;

        console.log(`MongoDB connected successfully`);
    } catch (error) {
        console.error(`Something went wrong while connecting to MongoDB:`, error);
        process.exit(1);
    }
};
