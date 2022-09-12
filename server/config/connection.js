import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URI || "mongodb://127.0.0.1:27017/merncommerse",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            }
        );

        console.log(`MONGO_DB connected: ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        console.log(`Error: ${error.message}`.red)
        process.exit(1)

    }
};

export default connectDB