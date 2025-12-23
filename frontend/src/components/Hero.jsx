
import React from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';
import Button from './Button';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '4rem 0',
            textAlign: 'center',
            marginBottom: '3rem'
        }}>
            <div className="container">
                <div
                    className="flex-center"
                    style={{
                        flexDirection: 'column',
                        gap: '1.5rem',
                        position: 'relative',
                        zIndex: 10
                    }}
                >
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        background: 'rgba(37, 99, 235, 0.1)',
                        color: 'var(--primary-color)',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                    }}>
                        <Sparkles size={16} />
                        <span>Welcome to the Future of Blogging</span>
                    </div>

                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '800',
                        lineHeight: '1.2',
                        background: 'linear-gradient(to right, var(--text-primary), var(--primary-color))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '1rem'
                    }}>
                        Share Your Story with <br /> the World.
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Discover trending topics, share your insights, and connect with a community of passionate writers.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <Link to="/create-blog">
                            <Button size="lg">Start Writing</Button>
                        </Link>
                        <Button variant="outline" size="lg" onClick={() => document.getElementById('posts').scrollIntoView({ behavior: 'smooth' })}>
                            Explore Posts <ArrowDown size={18} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Abstract Background Shapes (CSS Only) */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(255,255,255,0) 70%)',
                zIndex: 0
            }} />
        </div>
    );
};

export default Hero;
