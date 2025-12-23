
import { useState, useEffect } from 'react';
import API from '../services/api';
import PostCard from '../components/PostCard';
import Hero from '../components/Hero';
import Button from '../components/Button';
import { Download, Search } from 'lucide-react';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, [search]); // Basic search trigger, ideally debounce this

    const fetchPosts = async () => {
        try {
            const { data } = await API.get('/posts', { params: { search } });
            // Handle new response format: { success: true, count: N, data: [...] }
            setPosts(data.data || data || []);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleExportExcel = async () => {
        try {
            const response = await API.get('/posts/export/excel', {
                responseType: 'blob', // Important for file download
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'blog_posts.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Export failed", error);
            alert("Failed to export Excel file");
        }
    };

    // Frontend filtering removed; Backend now handles ?search= param.
    const filteredPosts = posts;

    return (
        <div>
            <Hero />

            <div className="container" id="posts">
                <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="flex-center" style={{ gap: '1rem', flex: 1, maxWidth: '500px' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search posts..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>

                    <Button variant="outline" onClick={handleExportExcel}>
                        <Download size={18} /> Export Results to Excel
                    </Button>
                </div>

                {loading ? (
                    <div className="flex-center" style={{ padding: '4rem' }}>Loading...</div>
                ) : (
                    <div className="grid-cols-3">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                                <h3>No posts found.</h3>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
