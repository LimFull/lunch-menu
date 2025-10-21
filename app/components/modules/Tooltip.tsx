'use client';

import { useState } from "react";

interface TooltipProps {
    text: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export const Tooltip = ({ 
    text, 
    children, 
    position = 'top',
    delay = 300 
}: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        const id = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        setTimeoutId(id);
    };

    const handleMouseLeave = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setIsVisible(false);
    };

    const getTooltipClasses = () => {
        const baseClasses = "absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg transition-all duration-200 ease-in-out whitespace-nowrap";
        
        switch (position) {
            case 'top':
                return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
            case 'bottom':
                return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2`;
            case 'left':
                return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-2`;
            case 'right':
                return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-2`;
            default:
                return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
        }
    };

    const getArrowClasses = () => {
        const baseClasses = "absolute w-2 h-2 bg-gray-900 transform rotate-45";
        
        switch (position) {
            case 'top':
                return `${baseClasses} top-full left-1/2 -translate-x-1/2 -mt-1`;
            case 'bottom':
                return `${baseClasses} bottom-full left-1/2 -translate-x-1/2 -mb-1`;
            case 'left':
                return `${baseClasses} left-full top-1/2 -translate-y-1/2 -ml-1`;
            case 'right':
                return `${baseClasses} right-full top-1/2 -translate-y-1/2 -mr-1`;
            default:
                return `${baseClasses} top-full left-1/2 -translate-x-1/2 -mt-1`;
        }
    };

    return (
        <div 
            className="relative inline-block" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
        >
            {children}
            
            {isVisible && (
                <div className={getTooltipClasses()}>
                    {text}
                    <div className={getArrowClasses()}></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;