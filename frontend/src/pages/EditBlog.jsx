
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import Button from '../components/Button';

const EditBlog = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        picture: '',
        categories: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await API.get(`/post/${id}`);
                // Handle new response format: { success: true, data: {...} }
                const post = data.data || data;
                setFormData({
                    title: post.title,
                    description: post.description,
                    picture: post.picture || '',
                    categories: post.categories || ''
                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchBlog();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/update/${id}`, formData);
            navigate(`/blog/${id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to update blog');
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Edit Story</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            name="title"
                            className="form-input"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <input
                            name="categories"
                            className="form-input"
                            value={formData.categories}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Image URL</label>
                        <input
                            name="picture"
                            className="form-input"
                            value={formData.picture}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Content</label>
                        <textarea
                            name="description"
                            className="form-input"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="12"
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Button variant="outline" onClick={() => navigate(`/blog/${id}`)}>Cancel</Button>
                        <Button type="submit">Update</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBlog;
