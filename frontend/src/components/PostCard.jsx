
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, FileText } from 'lucide-react';
import API from '../services/api';

const PostCard = ({ post }) => {
    const truncate = (str, n) => {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    };

    const handleExportWord = async (e) => {
        e.preventDefault(); // Prevent Link navigation
        try {
            const response = await API.get(`/posts/${post._id}/export/word`, {
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

    return (
        <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {post.picture && (
                <img
                    src={post.picture}
                    alt={post.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
            )}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', flexDirection: 'column' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={14} /> {post.username}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} /> {new Date(post.createdDate).toDateString()}
                        </span>
                    </div>
                    {/* Category Badge */}
                    {post.categories && post.categories.length > 0 && (
                        <span style={{
                            background: 'var(--primary-color)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '600'
                        }}>
                            {Array.isArray(post.categories) ? post.categories[0] : post.categories}
                        </span>
                    )}
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {truncate(post.title, 50)}
                </h3>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>
                    {truncate(post.description, 100)}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <Link to={`/blog/${post._id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontWeight: '600' }}>
                            Read More <ArrowRight size={16} />
                        </div>
                    </Link>

                    <button
                        onClick={handleExportWord}
                        className="btn-outline"
                        style={{
                            padding: '0.4rem 0.6rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.8rem',
                            borderColor: 'var(--border-color)',
                            background: 'transparent',
                            cursor: 'pointer',
                            borderRadius: '6px'
                        }}
                        title="Export to Word"
                    >
                        <FileText size={14} /> Export
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
