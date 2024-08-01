import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number
}

export const connection : connectionObject = {}

export const dbConnect = async () => {
    if(connection.isConnected){
        console.log("MongoDB is already connected")
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")

        console.log(`db :`, db)
        connection.isConnected = db.connections[0].readyState;

        console.log(`connection.isConnected : `, connection.isConnected)

        console.log(`MongoDB connected Succesfully `)
    } catch (error) {
        console.error(`Somthing went wrong while connecting to MongoDB: ${error}`)
        process.exit(1)
    }
}