import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
    return (
        <div className="blog-card">
            <h3>{blog.title}</h3>
            <p className="meta">
                By {blog.author?.username} on {new Date(blog.createdAt).toLocaleDateString()}
            </p>
            <p>{blog.excerpt}</p>
            <div className="tags">
                {blog.categories.map((cat, index) => (
                    <span key={index} className="tag category">{cat}</span>
                ))}
            </div>
            <Link to={`/blog/${blog._id}`} className="read-more">Read More</Link>
        </div>
    );
};

export default BlogCard;
