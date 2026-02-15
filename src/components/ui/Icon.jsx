import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Icon component wrapper for Flaticon uicons
 * Supports three styles: regular (rr), bold (br), solid (sr)
 * 
 * Usage: <Icon name="home" style="rr" size="lg" className="text-primary" />
 */

const sizeMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl'
};

export const Icon = ({
    name,
    style = 'rr', // rr (regular), br (bold), sr (solid)
    size = 'base',
    className = '',
    ...props
}) => {
    const sizeClass = sizeMap[size] || size;
    const iconClass = `fi fi-${style}-${name}`;

    return (
        <i
            className={cn(iconClass, sizeClass, className)}
            {...props}
        />
    );
};

// Commonly used icons as named exports for convenience
export const HomeIcon = (props) => <Icon name="home" {...props} />;
export const DashboardIcon = (props) => <Icon name="dashboard" {...props} />;
export const SettingsIcon = (props) => <Icon name="settings" {...props} />;
export const UserIcon = (props) => <Icon name="user" {...props} />;
export const ChartIcon = (props) => <Icon name="chart-histogram" {...props} />;
export const WalletIcon = (props) => <Icon name="wallet" {...props} />;
export const LockIcon = (props) => <Icon name="lock" {...props} />;
export const BrainIcon = (props) => <Icon name="brain" {...props} />;
export const ArrowRightIcon = (props) => <Icon name="arrow-right" {...props} />;
export const ArrowLeftIcon = (props) => <Icon name="arrow-left" {...props} />;
export const CheckIcon = (props) => <Icon name="check" {...props} />;
export const PlusIcon = (props) => <Icon name="plus" {...props} />;
export const TrashIcon = (props) => <Icon name="trash" {...props} />;
export const ClockIcon = (props) => <Icon name="clock" {...props} />;
export const MenuIcon = (props) => <Icon name="menu-burger" {...props} />;
export const XIcon = (props) => <Icon name="cross" {...props} />;

export default Icon;
