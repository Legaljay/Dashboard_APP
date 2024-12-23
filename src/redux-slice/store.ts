import { configureStore, ThunkAction, Action, Reducer, AnyAction, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import uiReducer from './ui.slice';
import authReducer from './auth/auth.slice';
import settingsReducer from './settings.slice';
import businessReducer from './business/business.slice';
import chatReducer from './chat/chat.slice';
import subscriptionReducer from './subscription/subscription.slice';
import walletReducer from './wallet/wallet.slice';
import teamReducer from './team/team.slice';
import filesReducer from './files/files.slice';
import featuresReducer from './features/features.slice';
import messagingReducer from './messaging/messaging.slice';
import notificationsReducer from './notifications/notifications.slice';
import channelsReducer from './channels/channels.slice';
import profileReducer from './profile/profile.slice';
import businessSubscriptionReducer from './business-subscription/business-subscription.slice';
import businessWalletReducer from './business-wallet/business-wallet.slice';
import businessCreditsReducer from './business-credits/business-credits.slice';
import appHistoryReducer from './app-history/app-history.slice';
import appCustomersReducer from './app-customers/app-customers.slice';
import appAnalyticsReducer from './app-analytics/app-analytics.slice';
import topupReducer from './topup/topup.slice';
import appSessionsReducer from './app-sessions/app-sessions.slice';
import appChatReducer from './app-chat/app-chat.slice';
import appWebhooksReducer from './app-webhooks/app-webhooks.slice';
import appIntegrationsReducer from './app-integrations/app-integrations.slice';
import transactionsReducer from './transactions/transactions.slice';
import appPeerReducer from './app-peer/app-peer.slice';
import chatRatingReducer from './chat-rating/chat-rating.slice';
import applicationsReducer from './applications/applications.slice';
import widgetReducer from './widget/widget.slice';
import memoryTemplateReducer from './memory-template/memory-template.slice';
import userReducer from './user/user.slice';
import appMemoryReducer from './app-memory/app-memory.slice';
import apiKeyReducer from './api-key/api-key.slice';
import mfaReducer from './mfa/mfa.slice';
import appCategoriesReducer from './app-categories/app-categories.slice';
import appInstructionsReducer from './app-instructions/app-instructions.slice';
import appDraftReducer from './app-draft/app-draft.slice';
import appPluginsReducer from './plugins/plugins.slice';
import currencyReducer from './currency/currency.slice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['ui', 'auth', 'settings', 'business', 'chat', 'currency', 'subscription', 'wallet', 'team', 'files', 'features', 'messaging', 'channels', 'profile', 'businessSubscription', 'businessWallet', 'businessCredits', 'appHistory', 'appCustomers', 'appAnalytics', 'topup', 'appSessions', 'appChat', 'appWebhooks', 'appIntegrations', 'transactions', 'appPeer', 'chatRating', 'applications', 'widget', 'memoryTemplate', 'notifications', 'user', 'memory', 'apiKeys', 'mfa', 'appCategories', 'appInstructions', 'appDraft', 'plugins'],
};

const rootReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  settings: settingsReducer,
  business: businessReducer,
  chat: chatReducer,
  subscription: subscriptionReducer,
  wallet: walletReducer,
  team: teamReducer,
  applications: applicationsReducer,
  files: filesReducer,
  features: featuresReducer,
  messaging: messagingReducer,
  channels: channelsReducer,
  profile: profileReducer,
  businessSubscription: businessSubscriptionReducer,
  businessWallet: businessWalletReducer,
  businessCredits: businessCreditsReducer,
  appHistory: appHistoryReducer,
  appCustomers: appCustomersReducer,
  appAnalytics: appAnalyticsReducer,
  topup: topupReducer,
  appSessions: appSessionsReducer,
  appChat: appChatReducer,
  appWebhooks: appWebhooksReducer,
  appIntegrations: appIntegrationsReducer,
  transactions: transactionsReducer,
  appPeer: appPeerReducer,
  chatRating: chatRatingReducer,
  widget: widgetReducer,
  memoryTemplate: memoryTemplateReducer,
  notifications: notificationsReducer,
  user: userReducer,
  memory: appMemoryReducer,
  apiKeys: apiKeyReducer,
  mfa: mfaReducer,
  appCategories: appCategoriesReducer,
  appInstructions: appInstructionsReducer,
  appDraft: appDraftReducer,
  plugins: appPluginsReducer,
  currency: currencyReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const persistor = persistStore(store);
