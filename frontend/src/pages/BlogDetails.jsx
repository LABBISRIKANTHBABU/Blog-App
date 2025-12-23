
import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import { Calendar, User, Edit, Trash2, FileText, ArrowLeft, Download } from 'lucide-react';

const BlogDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await API.get(`/post/${id}`);
                // Handle new response format: { success: true, data: {...} }
                setPost(data.data || data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await API.delete(`/delete/${id}`);
                navigate('/');
            } catch (error) {
                console.error(error);
                alert('Failed to delete post');
            }
        }
    };

    const handleExportWord = async () => {
        try {
            const response = await API.get(`/posts/${id}/export/word`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${post.title || 'post'}.docx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Export failed", error);
            alert("Failed to export Word file");
        }
    };

    if (!post) {
        return <div className="container flex-center" style={{ height: '50vh' }}><p>Loading...</p></div>;
    }

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <Button variant="outline" onClick={() => navigate('/')} style={{ marginBottom: '1.5rem', border: 'none', paddingLeft: 0 }}>
                <ArrowLeft size={16} /> Back to Home
            </Button>

            <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                {post.picture && (
                    <img
                        src={post.picture}
                        alt={post.title}
                        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '2rem' }}
                    />
                )}

                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', lineHeight: 1.2 }}>{post.title}</h1>

                <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={18} /> {post.username}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={18} /> {new Date(post.createdDate).toDateString()}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Button variant="outline" onClick={handleExportWord}>
                            <FileText size={16} /> Export to Word
                        </Button>

                        {user && user.username === post.username && (
                            <>
                                <Link to={`/edit-blog/${post._id}`}>
                                    <Button variant="primary">
                                        <Edit size={16} /> Edit
                                    </Button>
                                </Link>
                                <Button variant="outline" onClick={handleDelete} style={{ color: 'var(--error-color)', borderColor: 'var(--error-color)' }}>
                                    <Trash2 size={16} /> Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
                    {post.description}
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
