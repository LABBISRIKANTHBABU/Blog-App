
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from './Button';
import { PenSquare, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-panel" style={{
            position: 'sticky',
            top: '1rem',
            zIndex: 1000,
            margin: '0 1rem',
            padding: '0.75rem 0'
        }}>
            <div className="container flex-between">
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', textDecoration: 'none' }}>
                    InkFlow
                </Link>

                {/* Desktop Menu */}
                <div className="nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>Home</Link>

                    {user ? (
                        <>
                            <Link to="/create-blog">
                                <Button variant="primary">
                                    <PenSquare size={16} /> Write
                                </Button>
                            </Link>
                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user.username}</span>
                            <Button variant="outline" onClick={handleLogout}>
                                <LogOut size={16} />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login"><Button variant="outline">Login</Button></Link>
                            <Link to="/signup"><Button>Signup</Button></Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
