import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

const dbConnect = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log("Database is already Connected")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        connection.isConnected = db.connections[0].readyState
        console.log("Database connected Successfully")
    } catch (error) {
        console.log("Database Connection Failed", error)
        process.exit(1)
    }
}

export default dbConnect