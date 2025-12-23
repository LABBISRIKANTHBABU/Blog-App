import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './model/User.js';
import Post from './model/post.js';

dotenv.config();

const verifyUsers = async () => {
    try {
        const URL = process.env.DB || 'mongodb://127.0.0.1:27017/blog-app';
        console.log(`Connecting to ${URL}...`);

        await mongoose.connect(URL);
        console.log('Database connected successfully');

        const users = await User.find({});
        console.log(`\nFound ${users.length} registered users:`);

        if (users.length === 0) {
            console.log("No users found. Try signing up on the frontend first!");
        } else {
            users.forEach(u => console.log(`- User: ${u.username} (${u._id})`));
        }

        const posts = await Post.find({});
        console.log(`\nFound ${posts.length} blog posts:`);
        if (posts.length === 0) {
            console.log("No posts found. Please try 'Publish' again using the fixed app.");
        } else {
            posts.forEach(p => console.log(`- Post: "${p.title}" by ${p.username}`));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected');
    }
};

verifyUsers();
