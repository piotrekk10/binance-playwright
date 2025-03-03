export type SessionDataType = {
  authenticated: boolean;
  sessionFile: string;
};

export const AUTHENTICATED_USER: SessionDataType = {
  authenticated: true,
  sessionFile: ".auth/authUser.json",
};

export const NOT_AUTHENTICATED_USER: SessionDataType = {
  authenticated: false,

  sessionFile: ".auth/notAuthUser.json",
};