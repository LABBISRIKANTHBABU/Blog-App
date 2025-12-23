
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';

const CreateBlog = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        picture: '',
        categories: '', // Input as string
    });

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Include username and split categories
            const postPayload = {
                ...formData,
                categories: formData.categories.split(',').map(cat => cat.trim()), // Convert to Array
                username: user.username,
                createdDate: new Date()
            };

            await API.post('/create', postPayload);
            navigate('/');
        } catch (error) {
            console.error('Error creating blog:', error);
            const errMsg = error.response?.data?.message || error.response?.data?.msg || error.message || 'Failed to create blog';
            alert(`Error: ${errMsg}`);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Create New Story</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            name="title"
                            className="form-input"
                            placeholder="Enter an engaging title..."
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category (comma separated)</label>
                        <input
                            name="categories"
                            className="form-input"
                            placeholder="Technology, Lifestyle, Art..."
                            value={formData.categories}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Image URL (Optional)</label>
                        <input
                            name="picture"
                            className="form-input"
                            placeholder="https://..."
                            value={formData.picture}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Content</label>
                        <textarea
                            name="description"
                            className="form-input"
                            placeholder="Tell your story..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="12"
                            style={{ resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Button variant="outline" onClick={() => navigate('/')}>Cancel</Button>
                        <Button type="submit">Publish</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBlog;
