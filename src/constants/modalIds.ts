export const MODAL_IDS = {
  // Auth related modals
  LOGOUT_CONFIRM: 'logout-confirm',
  SESSION_EXPIRED: 'session-expired',
  PERSONALITY_MODAL: 'personality-modal',
  
  // Profile related modals
  EDIT_PROFILE: 'edit-profile',
  CHANGE_PASSWORD: 'change-password-modal',
  SETUP_2FA: 'setup-2fa-modal',
  
  // Settings related modals
  SETTINGS: 'settings',
  NOTIFICATIONS_SETTINGS: 'notifications-settings',
  
  // Confirmation modals
  CONFIRM_DELETE: 'confirm-delete',
  CONFIRM_ACTION: 'confirm-action',
  
  // Feature specific modals
  CREATE_NEW: 'create-new',
  EDIT_ITEM: 'edit-item',
  VIEW_DETAILS: 'view-details',
  
  // Help and support modals
  HELP_GUIDE: 'help-guide',
  CONTACT_SUPPORT: 'contact-support',
  
  // Custom modal generator
  custom: (id: string) => `custom-${id}`,
} as const;

// Type for modal IDs
export type ModalId = typeof MODAL_IDS[keyof typeof MODAL_IDS];
