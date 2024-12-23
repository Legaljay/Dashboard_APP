export interface ITeam {
  id: string;
  role: ITeamRole;
  invite_code: string | null;
  invite_email: string | null;
  invitation_status: string | null;
  default: boolean;
  invite_accepted: boolean;
  business: {
    id: string;
    name: string;
    website_url: string;
    description: string;
    country: string;
    business_email: string;
    team_size: string;
    category: string;
    purpose: string;
    subscription_plan: any | null;
    setup_assist_count: number;
    setup_assist_date: string | null;
    team: any[];
    created_at: string;
    updated_at: string;
  };
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    country: string;
    is_verified: boolean;
    config: {
      customer: boolean;
      welcomeGuide: boolean;
      settings: boolean;
      billing: boolean;
      bottomBilling: boolean;
    };
    status: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ITeamRole {
  id: string;
  name: string;
  description: string | null;
}

export interface ITeamInvitation {
  invite_email: string;
  roleId: string;
  businessId: string;
}

export interface ITeamMember extends ITeam {}
