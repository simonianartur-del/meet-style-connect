import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuickActionProps {
  title: string;
  icon: LucideIcon;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
}

const QuickAction: React.FC<QuickActionProps> = ({ 
  title, 
  icon: Icon, 
  onClick, 
  variant = 'primary' 
}) => {
  const variantClasses = {
    primary: 'bg-gradient-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20',
    secondary: 'bg-gradient-secondary text-white hover:shadow-lg',
    accent: 'bg-gradient-to-br from-accent to-accent-hover text-accent-foreground hover:shadow-lg'
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 rounded-2xl font-medium text-sm transition-all duration-300
        flex items-center justify-center space-x-2
        interactive-bounce
        ${variantClasses[variant]}
      `}
    >
      <Icon size={18} />
      <span>{title}</span>
    </button>
  );
};

export default QuickAction;