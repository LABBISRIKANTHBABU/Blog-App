import XLSX from 'xlsx';
import Post from '../model/post.js';

export const exportPostsToExcel = async (req, res) => {
    try {
        const posts = await Post.find({});
        const data = posts.map(post => ({
            Title: post.title,
            Author: post.username,
            Categories: post.categories,
            CreatedAt: post.createdDate
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Blogs');

        XLSX.writeFile(workbook, 'exports/blogs.xlsx');

        res.status(200).json('Excel file exported successfully');
    } catch (error) {
        res.status(500).json(error);
    }
};
