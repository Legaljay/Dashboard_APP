import React from 'react';
import { useSettingsState } from './hooks/useSettingsState';
import { SettingsNav } from './components/SettingsNav';
import { SettingsContent } from './components/SettingsContent';


const Settings: React.FC = () => {
  const { state, actions } = useSettingsState();

  return (
    <div className="w-full h-full flex">
      <SettingsNav
        handleNavigate={actions.handleNavigate}
      />
      <SettingsContent/>
    </div>
  );
};

export default Settings;