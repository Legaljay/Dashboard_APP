export enum ApiEndpoints {
  // Auth - Group 1 D
  LOGIN = 'dashboard/auth/login',
  REGISTER = 'dashboard/auth/register',
  VERIFY_EMAIL = 'dashboard/auth/verify-account',
  RESEND_EMAIL = 'dashboard/auth/resend-email',
  FORGOT_PASSWORD = 'dashboard/auth/forgot-password',
  RESET_PASSWORD = 'dashboard/auth/reset-password',
  ASSISTANT_SETUP = '/dashboard/applications/setup',


  // Auth - Group 2
  CHANGE_PASSWORD = '/auth/change-password',
  REFRESH_TOKEN = '/auth/refresh-token',
  LOGOUT = '/auth/logout',
  MFA_SETUP = '/auth/mfa/setup',
  MFA_VERIFY = '/auth/mfa/verify',

  // USER - NOTIFICATIONS D
  USER_NOTIFICATIONS = 'dashboard/notifications',
  USER_NOTIFICATION_SINGLE = 'dashboard/notifications/:id',
  USER_NOTIFICATION_READ = 'dashboard/notifications/:id/read',

  //USER - MFA D
  USER_MFA_GENERATE_SECRET = 'dashboard/user-mfa/generate-secret',
  USER_MFA_SETUP = 'dashboard/user-mfa/setup',
  USER_MFA_VERIFY = 'dashboard/user-mfa/verify-otp',
  USER_MFA_SETTINGS = 'dashboard/user-mfa/setting',
  USER_MFA_TOGGLE = 'dashboard/user-mfa/toggle',

  // USER - PROFILE D
  USER_PROFILE = '/dashboard/account/profile',
  USER_UPDATE = '/dashboard/account/profile',
  USER_PASSWORD = '/dashboard/account/change-password',
  USER_CONFIG = '/dashboard/account/account-config',
  USER_ACTIVITY = '/dashboard/account/activity',

  // Business - Group 1 D
  BUSINESS_ALL = '/dashboard/businesses',
  BUSINESS_UPDATE = '/dashboard/businesses',
  BUSINESS_CREATE = '/dashboard/businesses/create',
  BUSINESS_SINGLE = '/dashboard/businesses/:id/single',
  BUSINESS_ACTIVE = '/dashboard/businesses/active',
  BUSINESS_SWITCH = '/dashboard/businesses/:id/switch',
  BUSINESS_COMPLIANCE = '/dashboard/businesses/compliance/submit',

  // BUSINESS - SUBSCRIPTION D
  BUSINESS_SUBSCRIPTION_CURRENT = '/business-subscription/get/current',
  BUSINESS_SUBSCRIPTION_UPGRADE = '/business-subscription/upgrade/:base_sub_id',
  BUSINESS_SUBSCRIPTIONS_DOWNGRADE = '/business-subscription/downgrade/:base_sub_id',
  // Business Subscriptions D
  BUSINESS_SUBSCRIPTIONS_AVAILABLE = '/dashboard/subscriptions/business/available',

  // BUSINESS - WALLET D
  BUSINESS_WALLET = '/dashboard/wallet/get/all/:business_id',

  // Business Credits D
  BUSINESS_CREDITS = '/dashboard/businesses/credits',
  BUSINESS_CREDITS_USAGE = '/dashboard/businesses/credits/usage',
  BUSINESS_CREDITS_USAGE_BY_ID = '/dashboard/businesses/credits/usage/:id',

  // Legacy Business Credits
  LEGACY_BUSINESS_CREDITS = '/businesses/credits',
  LEGACY_BUSINESS_CREDITS_USAGE = '/businesses/credits/usage',
  LEGACY_BUSINESS_CREDITS_USAGE_BY_ID = '/businesses/credits/usage/:id',

  // Transactions NOT DONE
  TRANSACTIONS = '/dashboard/transactions',
  LEGACY_TRANSACTIONS = '/transactions',

  // Application Features D
  APP_FEATURES = '/dashboard/applications/:applicationId/features',
  APP_FEATURE_BY_ID = '/dashboard/applications/:applicationId/features/:id',
  APP_FEATURE_UPDATE = '/dashboard/applications/:applicationId/features/:id',
  APP_FEATURE_PUBLISH = '/dashboard/applications/:applicationId/features/:id/publish',

  // Legacy Application Features
  LEGACY_APP_FEATURES = '/applications/:applicationId/features',
  LEGACY_APP_FEATURE_BY_ID = '/applications/:applicationId/features/:id',
  LEGACY_APP_FEATURE_UPDATE = '/applications/:applicationId/features/:id',
  LEGACY_APP_FEATURE_PUBLISH = '/applications/:applicationId/features/:id/publish',

  // Application Draft D
  APP_DRAFT = '/dashboard/applications/:applicationId/draft',
  APP_DRAFT_PUBLISH = '/dashboard/applications/:applicationId/draft/publish',

  // Application Agent Custom Instructions D
  APP_CATEGORY_INSTRUCTIONS = '/dashboard/applications/:applicationId/category/:categoryId/instructions',
  APP_CATEGORY_INSTRUCTIONS_CREATE = '/dashboard/applications/:applicationId/category/:categoryId/instructions',
  APP_CATEGORY_ARCHIVED_INSTRUCTIONS = '/dashboard/applications/:applicationId/category/:categoryId/archived-instructions',
  APP_CATEGORY_INSTRUCTION_BY_ID = '/dashboard/applications/:applicationId/category/:categoryId/instructions/:id',
  APP_CATEGORY_INSTRUCTION_UPDATE = '/dashboard/applications/:applicationId/category/:categoryId/instructions/:id',
  APP_CATEGORY_INSTRUCTION_DELETE = '/dashboard/applications/:applicationId/category/:categoryId/instructions/:id',
  APP_CATEGORY_INSTRUCTION_PUBLISH = '/dashboard/applications/:applicationId/category/:categoryId/instructions/:id/publish',

  // Application Memory D
  APP_MEMORY = '/dashboard/applications/:applicationId/memory',
  APP_MEMORY_CREATE = '/dashboard/applications/:applicationId/memory',
  APP_MEMORY_BY_ID = '/dashboard/applications/:applicationId/memory/:applicationAssistantFileId',
  APP_MEMORY_DELETE = '/dashboard/applications/:applicationId/memory/:applicationAssistantFileId',
  APP_MEMORY_PUBLISH = '/dashboard/applications/:applicationId/memory/:applicationAssistantFileId/publish',
  APP_MEMORY_TRAIN = '/dashboard/applications/:applicationId/memory/train',

  // Application History D
  APP_HISTORY = '/dashboard/applications/:applicationId/history/:featureId',
  LEGACY_APP_HISTORY = '/applications/:applicationId/history/:featureId',

  // Application Customers D
  APP_CUSTOMERS = '/dashboard/applications/:applicationId/customers',
  APP_CUSTOMER_BY_ID = '/dashboard/applications/:applicationId/customers/:id',
  LEGACY_APP_CUSTOMERS = '/applications/:applicationId/customers',
  LEGACY_APP_CUSTOMER_BY_ID = '/applications/:applicationId/customers/:id',
  WIDGET_IDENTIFY_CUSTOMER = '/widget/identify-customer',

  // Business Analytics D
  APP_ANALYTICS = '/dashboard/applications/:applicationId/analytics',

  // Top-up D
  TOPUP_REQUEST_ENTERPRISE = '/dashboard/top-up/request-enterprise-payment',
  TOPUP_GENERATE = '/dashboard/top-up/generate',
  TOPUP_FLUTTERWAVE_NOTIFICATION = '/dashboard/top-up/flutterwave-notification',

  // Application Sessions D
  APP_SESSION = '/dashboard/applications/:applicationId/session',
  APP_SESSION_CONNECT = '/dashboard/applications/:applicationId/session/connect',
  APP_SESSION_DISCONNECT = '/dashboard/applications/:applicationId/session/:id/disconnect',
  LEGACY_APP_SESSIONS = '/applications/:applicationId/sessions',
  LEGACY_APP_SESSION_CONNECT = '/applications/:applicationId/sessions/connect',

  // Webhooks NOT DONE
  DASHBOARD_REQUEST = '/dashboard/request',
  WEBHOOK_MESSAGE_BIRD_CONVERSATION = '/webhook/message-bird-conversation',
  WEBHOOK_MESSAGE_BIRD_MESSAGING = '/webhook/message-bird-messaging-conversation',

  // Application Chat NOT DONE
  APP_CHAT_DEMO = '/dashboard/applications/:applicationId/chat/create-demo',
  APP_CHAT_CREATE_EMPLOYEE = '/dashboard/applications/:applicationId/chat/create-employee',
  APP_CHAT_CREATE = '/dashboard/applications/:applicationId/chat/create',
  APP_CHAT = '/dashboard/applications/:applicationId/chat',
  APP_CHAT_BY_ID = '/dashboard/applications/:applicationId/chat/:id',
  APP_CHAT_DELETE = '/dashboard/applications/:applicationId/chat/:id',

  // Legacy Application Chat
  LEGACY_APP_CHAT_CREATE_EMPLOYEE = '/applications/:applicationId/chat/create-employee',
  LEGACY_APP_CHAT_CREATE_AGENT_EMPLOYEE = '/applications/:applicationId/chat/create-agent-employee',
  LEGACY_APP_CHAT = '/applications/:applicationId/chat',
  LEGACY_APP_CHAT_BY_ID = '/applications/:applicationId/chat/:id',

  // Application Chat Conversations NOT DONE
  APP_CHAT_SEND_DEMO = '/dashboard/applications/:applicationId/chat/:askAgentChatId/conversations/send-demo',
  APP_CHAT_SEND_TEST_EMPLOYEE = '/dashboard/applications/:applicationId/chat/:askAgentChatId/conversations/send-test-employee',
  APP_CHAT_SEND = '/dashboard/applications/:applicationId/chat/:askAgentChatId/conversations/send',
  APP_CHAT_CONVERSATIONS = '/dashboard/applications/:applicationId/chat/:askAgentChatId/conversations',

  // Legacy Chat Conversations
  LEGACY_APP_CHAT_SEND = '/applications/:applicationId/chat/:askAgentChatId/conversations/send',
  LEGACY_APP_CHAT_CONVERSATIONS = '/applications/:applicationId/chat/:askAgentChatId/conversations',

  // Application Peer D
  APP_PEER_REQUEST = '/businesses/application/:applicationId/peer/request',
  APP_PEER_REQUEST_RESEND = '/businesses/application/:applicationId/peer/request/resend',
  APP_PEER_CONNECT = '/businesses/application/:applicationId/peer/connect',
  APP_PEER_DELETE = '/businesses/application/:applicationId/peer',
  APP_PEER_DISCONNECT = '/businesses/application/:applicationId/peer/:id/disconnect',

  // Application Memory Templat D
  APP_MEMORY_TEMPLATE = '/dashboard/applications/:applicationId/memory-template',
  APP_MEMORY_TEMPLATE_CREATE = '/dashboard/applications/:applicationId/memory-template',
  APP_MEMORY_TEMPLATE_BY_ID = '/dashboard/applications/:applicationId/memory-template/:id',
  APP_MEMORY_TEMPLATE_DELETE = '/dashboard/applications/:applicationId/memory-template/:id',

  // Chat Conversation Rating D
  APP_CHAT_CONVERSATION_RATING = '/dashboard/applications/:applicationId/chat/:askAgentChatId/conversations/:askAgentChatConversationMessageId/rating',

  // Application Agent Categories D
  APP_CATEGORIES = '/dashboard/applications/:applicationId/category',
  APP_CATEGORY_CREATE = '/dashboard/applications/:applicationId/category',
  APP_CATEGORY_BY_ID = '/dashboard/applications/:applicationId/category/:id',
  APP_CATEGORY_UPDATE = '/dashboard/applications/:applicationId/category/:id',
  APP_CATEGORY_DELETE = '/dashboard/applications/:applicationId/category/:id',

  // Miscellaneous NOT DONE
  MISC_COUNTRIES = '/misc/countries',

  // Application Inbox NOT DONE
  APP_INBOX = '/dashboard/applications/:applicationId/inbox',
  APP_INBOX_CONVERSATION = '/dashboard/applications/:applicationId/inbox/:conversationId',
  APP_INBOX_MARK_READ = '/dashboard/applications/:applicationId/inbox/:conversationId/mark-as-read',

  // Gift Cards NOT DONE
  GIFTCARD_CREATE = '/wano-giftcards/create',
  GIFTCARD_REDEEM = '/wano-giftcards/redeem/:businessId',

  // Application Widget P-D
  WIDGET_CREATE_CONTACT = '/application-widget/create-contact',
  WIDGET_VALIDATE = '/application-widget/validate',
  WIDGET_CREATE_CONVERSATION = '/application-widget/create-conversation', //NOT DONE
  WIDGET_DASHBOARD_CONVERSATIONS = '/application-widget/dashboard/conversation/:applicationId', //NOT DONE
  WIDGET_CONVERSATION_BY_ID = '/application-widget/dashboard/conversation/:conversationId/get', //NOT DONE
  WIDGET_USER_CONVERSATIONS = '/application-widget/conversation/user/:userId', //NOT DONE
  WIDGET_CONVERSATION_MESSAGES = '/application-widget/conversation/:conversationId/messages', //NOT DONE

  // Applications - Core D
  APPLICATIONS = '/dashboard/applications',
  APPLICATION_CREATE = '/dashboard/applications/create',
  APPLICATION_SETUP = '/dashboard/applications/setup',
  APPLICATION_BY_ID = '/dashboard/applications/:id',
  APPLICATION_CONFIG = '/dashboard/applications/:id/config',
  APPLICATION_RESET_TYPE = '/dashboard/applications/:id/reset-type',
  APPLICATION_DEACTIVATE = '/dashboard/applications/:id/deactivate',

  // AppStore - Plugins D
  PLUGINS = '/dashboard/plugins',
  PLUGIN_CREATE = '/dashboard/plugins',
  PLUGIN_REMOVE = '/dashboard/plugins/:id/remove',
  PLUGIN_FEATURES_BY_APP = '/dashboard/plugins/:id/application/:applicationId/features', //NOT DONE
  APP_PLUGINS = '/dashboard/applications/:applicationId/plugins',
  APP_PLUGIN_CREATE = '/dashboard/applications/:applicationId/plugins',
  APP_PLUGIN_BY_ID = '/dashboard/applications/:applicationId/plugins/:id', //NOT DONE
  APP_PLUGIN_FEATURES = '/dashboard/applications/:applicationId/plugins/:id/features', //NOT DONE
  APP_PLUGIN_DETAIL = '/dashboard/applications/:applicationId/plugins/:applicationModuleId/plugins/:id', //NOT DONE
  APP_PLUGIN_FEATURE_UPDATE = '/dashboard/applications/:applicationId/plugins/:applicationModuleId/features/:id',
  APP_PLUGIN_FEATURE_PUBLISH = '/dashboard/applications/:applicationId/plugins/:applicationModuleId/features/:id/publish', //NOT DONE
  APP_PLUGIN_PUBLISH = '/dashboard/applications/:applicationId/plugins/:id/publish',
  APP_PLUGIN_VERIFY_CONFIG = '/dashboard/applications/:applicationId/plugins/:id/configuration-verification',
  APP_PLUGIN_UPDATE_CONFIG = '/dashboard/applications/:applicationId/plugins/:id/configuration',
  APP_PLUGIN_DELETE = '/dashboard/applications/:applicationId/plugins/:id/remove', //NOT DONE

  // API Keys D
  API_KEY = '/dashboard/api-key',
  API_KEY_RESET_PUBLIC = '/dashboard/api-key/reset-public-key',
  API_KEY_RESET_SECRET = '/dashboard/api-key/reset-secret-key',

  // Currency D
  CURRENCY_RATES = '/currency/rates',
  CURRENCY_CONVERT = '/currency/convert',
  CURRENCY_RATE_EXCHANGE = '/currency/rate-exchange',

  // Messaging D
  APP_MESSAGING_SEND = '/applications/:applicationId/messaging/send',

  // Business Channels D
  APP_CHANNELS = '/dashboard/applications/:applicationId/channels',

  // Business Team Management D
  BUSINESS_TEAM_MEMBERS = '/dashboard/team-members',
  BUSINESS_TEAM_ROLES = '/dashboard/team-members/roles',
  BUSINESS_TEAM_INVITE = '/dashboard/team-members/invite',
  BUSINESS_TEAM_MEMBER_UPDATE = '/dashboard/team-members/:id',
  BUSINESS_TEAM_MEMBER_REMOVE = '/dashboard/team-members/remove/:id',
  BUSINESS_TEAM_INVITE_VERIFY = '/dashboard/team-members/invite/:token',
  BUSINESS_TEAM_JOIN = '/dashboard/team-members/join-team/:token',
  BUSINESS_TEAM_ACCEPT = '/dashboard/team-members/accept-team/:token',

}
