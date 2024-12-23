import React from 'react';
import './DashboardCard.css';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = '',
}) => {
  return (
    <div className={`dashboard-card ${className}`}>
      <div className="dashboard-card-header">
        {icon && <div className="dashboard-card-icon">{icon}</div>}
        <h3 className="dashboard-card-title">{title}</h3>
      </div>
      <div className="dashboard-card-content">
        <div className="dashboard-card-value">{value}</div>
        {trend && (
          <div className={`dashboard-card-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
