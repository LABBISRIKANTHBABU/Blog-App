import mongoose from 'mongoose';

const Connection = async () => {
    const URL = process.env.DB || 'mongodb://127.0.0.1:27017/blog-app';

    try {
        await mongoose.connect(URL);
        console.log('✅ Database connected successfully');
        console.log('📁 Database:', mongoose.connection.db.databaseName);
        console.log('🔗 Connection state:', mongoose.connection.readyState);

        // List collections to verify persistence
        mongoose.connection.db.listCollections().toArray((err, collections) => {
            if (collections) {
                console.log('📊 Collections:', collections.map(c => c.name).join(', '));
            }
        });
    } catch (error) {
        console.error('❌ DB connection failed:', error.message);
        process.exit(1); // Fail fast if DB connection fails
    }
};

export default Connection;
