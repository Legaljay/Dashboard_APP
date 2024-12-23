import { lazy } from 'react';

export const Plugins = lazy(() => import('./components/Plugins'));
export const PluginType = lazy(() => import('./components/PluginType'));
export const AllPluginType = lazy(() => import('./components/AllPluginType'));
export const OtherPlugins = lazy(() => import('./components/OtherPlugins'));
