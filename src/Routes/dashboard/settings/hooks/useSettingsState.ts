import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { settingsRoutes, getRouteByPath } from '../routes';
import { useAppDispatch, useAppSelector } from '@/redux-slice/hooks';
import { selectAdjacentPlans } from '@/redux-slice/business-subscription/business-subscription.slice';
import { fetchTeamRoles, fetchTeamMembers } from '@/redux-slice/business/business.slice';
import { getMFASettings } from '@/redux-slice/mfa/mfa.slice';

export const useSettingsState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // State Management
  const [reroute, setReroute] = useState("/dashboard/settings");
  const [isFormModified, setIsFormModified] = useState(false);
  const [showUnsavedSettingsModal, setShowUnsavedSettingsModal] = useState(false);
  
  // Modal States
  const [openTourModal, setOpenTourModal] = useState(false);
  const [openSetupAssistance, setOpenSetupAssistance] = useState(false);
  const [openUpgradeToPlan, setOpenUpgradeToPlan] = useState(false);
  const [openUpgradePlan, setOpenUpgradePlan] = useState(false);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [openRedeemGift, setOpenRedeemGift] = useState(false);
  const [openRedeemSuccess, setOpenRedeemSuccess] = useState(false);

  // Redux Selectors
  const subscriptions = useAppSelector((state) => state.businessSubscription.availableSubscriptions);
  const currentPlan = useAppSelector((state) => state.businessSubscription.currentSubscription);
  const { previousPlan, nextPlan } = useAppSelector(selectAdjacentPlans);
  const business = useAppSelector(state => state.business.activeBusiness);
  const businessID = business?.id;
  const teamRoles = useAppSelector((state) => state.business.team.roles);


  useEffect(() => {
    dispatch(fetchTeamMembers());
    dispatch(fetchTeamRoles());
    dispatch(getMFASettings());
  }, [dispatch]);

  // Handlers
  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [isFormModified, navigate]);

  const handleCloseSetupAssistance = useCallback(() => {
    setOpenSetupAssistance(false);
    navigate("/dashboard/settings", { replace: true });
  }, [navigate]);


  return {
    state: {
      currentPath: location.pathname,
      currentRoute: getRouteByPath(location.pathname),
      openTourModal,
      openSetupAssistance,
      openUpgradeToPlan,
      openUpgradePlan,
      openPayModal,
      openRedeemGift,
      openRedeemSuccess,
      showUnsavedSettingsModal,
      isFormModified,
      reroute,
      plan: {
        currentPlan,
        nextPlan,
        previousPlan,
        subscriptions
      },
      businessID,
      teamRoles
    },
    actions: {
      handleNavigate,
      setOpenTourModal,
      setOpenSetupAssistance,
      setOpenUpgradeToPlan,
      setOpenUpgradePlan,
      setOpenPayModal,
      setOpenRedeemGift,
      setOpenRedeemSuccess,
      handleCloseSetupAssistance,
    }
  };
};
