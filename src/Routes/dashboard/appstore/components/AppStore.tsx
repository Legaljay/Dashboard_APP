import React, { useState } from 'react';
import { AppStoreItem } from '../../../../types/dashboard';
import './AppStore.css';

// Dummy data
const dummyApps: AppStoreItem[] = [
  {
    id: '1',
    name: 'Data Analyzer',
    description: 'Advanced data analysis and visualization tool',
    icon: '📊',
    category: 'Analytics',
    price: 29.99,
    installed: false,
  },
  {
    id: '2',
    name: 'Chat Bot',
    description: 'AI-powered chatbot for customer support',
    icon: '🤖',
    category: 'Support',
    price: 49.99,
    installed: true,
  },
  // Add more dummy apps as needed
];

const AppCard: React.FC<{
  app: AppStoreItem;
  onInstall: (id: string) => void;
  onUninstall: (id: string) => void;
}> = ({ app, onInstall, onUninstall }) => {
  return (
    <div className="app-card">
      <div className="app-icon">{app.icon}</div>
      <div className="app-info">
        <h3>{app.name}</h3>
        <p>{app.description}</p>
        <div className="app-meta">
          <span className="app-category">{app.category}</span>
          <span className="app-price">${app.price}</span>
        </div>
      </div>
      <button
        className={`app-action-button ${app.installed ? 'uninstall' : 'install'}`}
        onClick={() => app.installed ? onUninstall(app.id) : onInstall(app.id)}
      >
        {app.installed ? 'Uninstall' : 'Install'}
      </button>
    </div>
  );
};

const AppStore: React.FC = () => {
  const [apps, setApps] = useState<AppStoreItem[]>(dummyApps);
  const [filter, setFilter] = useState<string>('all');

  const handleInstall = (id: string) => {
    setApps(apps.map(app =>
      app.id === id ? { ...app, installed: true } : app
    ));
  };

  const handleUninstall = (id: string) => {
    setApps(apps.map(app =>
      app.id === id ? { ...app, installed: false } : app
    ));
  };

  const filteredApps = filter === 'all'
    ? apps
    : apps.filter(app => app.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="appstore-container">
      <div className="appstore-header">
        <h1>App Store</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          <option value="analytics">Analytics</option>
          <option value="support">Support</option>
          <option value="productivity">Productivity</option>
        </select>
      </div>

      <div className="apps-grid">
        {filteredApps.map(app => (
          <AppCard
            key={app.id}
            app={app}
            onInstall={handleInstall}
            onUninstall={handleUninstall}
          />
        ))}
      </div>
    </div>
  );
};

export default AppStore;
