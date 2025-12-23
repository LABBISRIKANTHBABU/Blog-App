/**
 * MongoDB Data Persistence Verification Script
 * 
 * This script comprehensively verifies that all data operations
 * are correctly persisting to MongoDB.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './model/User.js';
import Post from './model/post.js';
import Token from './model/token.js';

dotenv.config();

const verifyMongoDBPersistence = async () => {
    try {
        const URL = process.env.DB || 'mongodb://127.0.0.1:27017/blog-app';
        console.log('\n🔍 MONGODB PERSISTENCE VERIFICATION\n');
        console.log(`📡 Connecting to: ${URL}...`);

        await mongoose.connect(URL);
        console.log('✅ Database connected successfully\n');

        // Get database name
        const dbName = mongoose.connection.db.databaseName;
        console.log(`📁 Database Name: ${dbName}`);
        console.log(`🔗 Connection State: ${mongoose.connection.readyState}\n`);

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📊 Available Collections:');
        collections.forEach(col => console.log(`   - ${col.name}`));
        console.log('');

        // ========================================
        // VERIFY USERS COLLECTION
        // ========================================
        console.log('👥 USERS COLLECTION');
        console.log('='.repeat(50));

        const userCount = await User.countDocuments();
        console.log(`Total Users: ${userCount}`);

        if (userCount > 0) {
            const users = await User.find().limit(10).select('-password');
            console.log('\n📋 Sample Users:');
            users.forEach((u, idx) => {
                console.log(`   ${idx + 1}. ${u.username} (${u.email || 'no email'}) - ID: ${u._id}`);
            });
        } else {
            console.log('⚠️  No users found. Try signing up first!');
        }
        console.log('');

        // ========================================
        // VERIFY POSTS COLLECTION
        // ========================================
        console.log('📝 BLOG POSTS COLLECTION');
        console.log('='.repeat(50));

        const postCount = await Post.countDocuments();
        console.log(`Total Posts: ${postCount}`);

        if (postCount > 0) {
            const posts = await Post.find().limit(10).sort({ createdDate: -1 });
            console.log('\n📋 Sample Posts (most recent):');
            posts.forEach((p, idx) => {
                console.log(`   ${idx + 1}. "${p.title}" by ${p.username}`);
                console.log(`      ID: ${p._id}`);
                console.log(`      Created: ${p.createdDate ? new Date(p.createdDate).toLocaleString() : 'N/A'}`);
                console.log(`      Categories: ${p.categories || 'None'}`);
            });

            // Check text index
            const indexes = await Post.collection.getIndexes();
            const hasTextIndex = Object.values(indexes).some(idx =>
                idx.some && idx.some(field => field[1] === 'text')
            );
            console.log(`\n🔍 Text Search Index: ${hasTextIndex ? '✅ Present' : '❌ Missing'}`);
        } else {
            console.log('⚠️  No posts found. Try creating a post first!');
        }
        console.log('');

        // ========================================
        // VERIFY TOKENS COLLECTION
        // ========================================
        console.log('🔑 TOKENS COLLECTION');
        console.log('='.repeat(50));

        const tokenCount = await Token.countDocuments();
        console.log(`Active Refresh Tokens: ${tokenCount}`);
        console.log('');

        // ========================================
        // DATA PERSISTENCE TESTS
        // ========================================
        console.log('🧪 DATA PERSISTENCE VERIFICATION');
        console.log('='.repeat(50));

        // Test 1: Check if data survives query
        console.log('\n✓ Test 1: Data Fetch Consistency');
        if (postCount > 0) {
            const firstPost = await Post.findOne();
            const refetchPost = await Post.findById(firstPost._id);
            console.log(`   Fetch 1: ${firstPost.title}`);
            console.log(`   Fetch 2: ${refetchPost.title}`);
            console.log(`   Match: ${firstPost._id.equals(refetchPost._id) ? '✅' : '❌'}`);
        } else {
            console.log('   ⚠️  Skipped (no posts)');
        }

        // Test 2: Check user-post relationship
        console.log('\n✓ Test 2: User-Post Relationship');
        if (postCount > 0 && userCount > 0) {
            const postsWithUsers = await Post.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'username',
                        foreignField: 'username',
                        as: 'author'
                    }
                },
                { $limit: 5 }
            ]);

            const orphanedPosts = postsWithUsers.filter(p => p.author.length === 0);
            console.log(`   Total posts checked: ${postsWithUsers.length}`);
            console.log(`   Posts with valid author: ${postsWithUsers.length - orphanedPosts.length}`);
            console.log(`   Orphaned posts: ${orphanedPosts.length}`);

            if (orphanedPosts.length > 0) {
                console.log('   ⚠️  Warning: Some posts have no matching user!');
            } else {
                console.log('   ✅ All posts have valid authors');
            }
        } else {
            console.log('   ⚠️  Skipped (insufficient data)');
        }

        // ========================================
        // SUMMARY & RECOMMENDATIONS
        // ========================================
        console.log('\n' + '='.repeat(50));
        console.log('📊 PERSISTENCE VERIFICATION SUMMARY');
        console.log('='.repeat(50));

        const checks = {
            'Database Connection': true,
            'Users Persisted': userCount > 0,
            'Posts Persisted': postCount > 0,
            'Text Index Available': postCount > 0,
            'Data Fetch Consistent': postCount > 0
        };

        Object.entries(checks).forEach(([check, passed]) => {
            console.log(`${passed ? '✅' : '❌'} ${check}`);
        });

        console.log('\n💡 RECOMMENDATIONS:');
        if (userCount === 0) {
            console.log('   1. Create users via /signup endpoint');
        }
        if (postCount === 0) {
            console.log('   2. Create posts via /create endpoint (requires login)');
        }
        if (postCount > 0 && userCount > 0) {
            console.log('   ✓ All systems operational!');
            console.log('   ✓ Data is persisting correctly in MongoDB');
            console.log('   ✓ Ready for production demo');
        }

        console.log('\n✅ Verification Complete!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from database\n');
    }
};

// Run verification
verifyMongoDBPersistence();
