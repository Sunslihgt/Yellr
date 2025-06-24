import React from 'react';

interface ToggleButtonProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    className?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ checked, onChange, label, className }) => {
    return (
        <div className={`flex items-center space-x-2 ${className || ''}`}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                tabIndex={0}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${checked ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                onClick={() => onChange(!checked)}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onChange(!checked);
                    }
                }}
            >
                <span
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : ''}`}
                />
            </button>
            {label && <span className="text-gray-700 dark:text-gray-300">{label}</span>}
        </div>
    );
};

export default ToggleButton; 