export enum AuthState {
    INITIAL_SESSION = 'INITIAL_SESSION',
    SIGNED_IN = 'SIGNED_IN',
    SIGNED_OUT = 'SIGNED_OUT',
    PASSWORD_RECOVERY = 'PASSWORD_RECOVERY',
    TOKEN_REFRESHED = 'TOKEN_REFRESHED',
    USER_UPDATED = 'USER_UPDATED',
  }

// Reference: https://supabase.com/docs/reference/javascript/auth-onauthstatechange