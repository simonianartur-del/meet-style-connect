import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'text-primary',
  onClick,
  className = '',
  style
}) => {
  return (
    <div 
      className={`card-premium p-4 text-center cursor-pointer interactive ${className}`}
      onClick={onClick}
      style={style}
    >
      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;