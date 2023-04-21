export type LoginPayload = {
  login: string;
  password: string;
};

export type Tokens = {
  authToken: string;
  refreshToken: string;
};
