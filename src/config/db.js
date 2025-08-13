import mongoose from 'mongoose';
export async function dbconnect() {
    mongoose.connect(process.env.DB_CONNECT_STRING)
}

