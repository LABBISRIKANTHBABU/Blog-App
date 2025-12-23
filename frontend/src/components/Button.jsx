
import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    onClick,
    isLoading = false,
    className = '',
    disabled = false
}) => {
    const baseClass = 'btn';
    const variantClass = variant === 'outline' ? 'btn-outline' : 'btn-primary';

    return (
        <button
            type={type}
            className={`${baseClass} ${variantClass} ${className}`}
            onClick={onClick}
            disabled={disabled || isLoading}
        >
            {isLoading && <Loader2 className="animate-spin" size={16} />}
            {children}
        </button>
    );
};

export default Button;
