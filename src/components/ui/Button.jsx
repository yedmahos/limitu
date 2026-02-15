import React from 'react';
// import { cva } from 'class-variance-authority';
// Wait, I didn't install class-variance-authority. I shoud stick to simple cn usage or install it.
// Given the "lightweight" MVP, I'll stick to a simple switch or just install it implicitly?
// No, I'll just write it with `cn` and conditional logic for now to avoid installing more deps if I can.
// Actually, standard shadcn uses cva. It's very useful.
// I'll implement a simple version without cva to save time/deps, or I can install it.
// Let's stick to `cn` for simplicity.

import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', isLoading, children, ...props }, ref) => {
    const variants = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
                variants[variant],
                sizes[size],
                className
            )}
            ref={ref}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <i className="fi fi-rr-spinner mr-2 text-base animate-spin"></i>}
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
