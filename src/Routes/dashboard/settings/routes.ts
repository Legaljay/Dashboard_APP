import { lazy } from 'react';

const Profile = lazy(() => import('./components/sections/Profile'));
const Teams = lazy(() => import('./components/sections/Teams'));
const ApiKeys = lazy(() => import('./components/sections/ApiKeys'));
const Plan = lazy(() => import('./components/Plan'));

export interface SettingsRoute {
  path: string;
  component: React.LazyExoticComponent<any>;
  label: string;
  icon?: string;
}

export const settingsRoutes: Record<string, SettingsRoute> = {
  profile: {
    path: '/dashboard/settings',
    component: Profile,
    label: 'Profile',
  },
  teams: {
    path: '/dashboard/settings/teams',
    component: Teams,
    label: 'Teams',
  },
  apiKeys: {
    path: '/dashboard/settings/api-keys',
    component: ApiKeys,
    label: 'API Keys',
  },
  plan: {
    path: '/dashboard/settings/plan',
    component: Plan,
    label: 'Plan',
  },
};

export const getRouteByPath = (path: string): SettingsRoute | undefined => {
  return Object.values(settingsRoutes).find(route => route.path === path);
};

export const getRouteByLabel = (label: string): SettingsRoute | undefined => {
  return Object.values(settingsRoutes).find(route => route.label === label);
};
