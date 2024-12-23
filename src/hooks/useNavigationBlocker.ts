import { useCallback, useState, useEffect } from 'react';
import { useBlocker, useNavigate, Location } from 'react-router-dom';

interface BlockerState {
  currentLocation: Location;
  nextLocation: Location;
}

interface NavigationBlockerOptions {
  isDirty: boolean;
  onSave: () => Promise<void>;
  /**
   * The base path to check against when determining if navigation is leaving the section
   * e.g., '/settings', '/profile', etc.
   */
  basePath: string;
}

export const useNavigationBlocker = ({ isDirty, onSave, basePath }: NavigationBlockerOptions) => {
  const navigate = useNavigate();
  const [pendingLocation, setPendingLocation] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }: BlockerState) => {
        // Check if we're navigating away from the base path section
        const isLeavingSection = currentLocation.pathname.includes(basePath) && 
          !nextLocation.pathname.includes(basePath);
        
        // Block navigation if form is dirty and either:
        // 1. Navigating between different pages within the section
        // 2. Navigating away from the section completely
        return isDirty && (
          (currentLocation.pathname !== nextLocation.pathname) || 
          isLeavingSection
        );
      },
      [isDirty, basePath]
    )
  );

  useEffect(() => {
    if (blocker.state === 'blocked' && !showModal) {
      setPendingLocation(blocker.location?.pathname ?? null);
      setShowModal(true);
    }
  }, [blocker.state, blocker.location, showModal]);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setPendingLocation(null);
    if (blocker.state === "blocked") {
      blocker.reset?.();
    }
  }, [blocker]);

  const handleDiscard = useCallback(() => {
    if (blocker.state === "blocked") {
      blocker.proceed?.();
    }
    handleModalClose();
    if (pendingLocation) {
      setTimeout(() => {
        navigate(pendingLocation);
      }, 500);
      // navigate(pendingLocation);
    }
  }, [blocker, handleModalClose, navigate, pendingLocation]);

  const handleSave = useCallback(async () => {
    try {
      await onSave();
      if (blocker.state === "blocked") {
        blocker.proceed?.();
      }
      if (pendingLocation) {
        setTimeout(() => {
          navigate(pendingLocation);
        }, 500);
      }
      handleModalClose();
    } catch (error) {
      // Error handling is managed by the form submission logic
    }
  }, [blocker, handleModalClose, navigate, onSave, pendingLocation]);

  return {
    showModal,
    onClose: handleModalClose,
    onConfirm: handleSave,
    onDiscard: handleDiscard,
  };
};
