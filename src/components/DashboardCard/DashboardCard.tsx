import React from 'react';
import './DashboardCard.css';

interface DashboardCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  trend,
  icon,
  onClick,
}) => {
  const trendClass = trend
    ? trend > 0
      ? 'trend-up'
      : trend < 0
      ? 'trend-down'
      : ''
    : '';

  return (
    <div
      className={`dashboard-card ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="dashboard-card-header">
        {icon && <div className="dashboard-card-icon">{icon}</div>}
        <h3 className="dashboard-card-title">{title}</h3>
      </div>
      
      <div className="dashboard-card-content">
        <p className="dashboard-card-value">{value}</p>
        {trend !== undefined && (
          <div className={`dashboard-card-trend ${trendClass}`}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : ''}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
};
