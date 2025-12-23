import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const { data } = await API.get('/blogs');
            // Filter if you only want admin's blogs? Or all blogs? 
            // Usually dashboard shows all or user's. Let's show all for admin.
            setBlogs(data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteBlog = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await API.delete(`/blogs/${id}`);
                setBlogs(blogs.filter(blog => blog._id !== id));
            } catch (error) {
                alert('Failed to delete');
            }
        }
    };

    const handleExport = async () => {
        try {
            // Trigger download
            window.open('http://localhost:5000/api/blogs/export/excel', '_blank');
        } catch (error) {
            alert('Export failed');
        }
    }

    return (
        <div className="container dashboard">
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user && user.username}</p>
            <div className="actions">
                <Link to="/create-blog" className="btn btn-primary">Create New Blog</Link>
                <button onClick={handleExport} className="btn btn-secondary">Export to Excel</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map(blog => (
                        <tr key={blog._id}>
                            <td>{blog.title}</td>
                            <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                            <td>
                                <Link to={`/edit-blog/${blog._id}`} className="btn-small">Edit</Link>
                                <button onClick={() => deleteBlog(blog._id)} className="btn-small btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
