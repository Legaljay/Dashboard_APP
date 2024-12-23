export interface Response {
    message: string;
    status:string;
}

export interface MFASettings {
    is_enabled: boolean;
    is_setup: boolean
}

export interface MFASettingsResponse extends Response {
    data: MFASettings;
}

export interface SetupMFAResponse {

}

export interface verifyMFAResponse {
    
}

export interface ToggleMFAResponse extends Response {
    
}

export interface GenerateMFASecret {
    secret: string;
    url: string;
}

export interface GenerateMFASecretResponse extends Response {
    data: GenerateMFASecret;
}