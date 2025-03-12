import Cookies from "js-cookie";

const AUTH_TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const SaveCredentialstoCookie = (email: string, password: string) => {
  Cookies.set("cookieEmail", email, { expires: 7 });
  Cookies.set("cookiePassword", password, { expires: 7 });
};

export const GetCookieCredentails = () => {
  const email = Cookies.get("cookieEmail");
  const password = Cookies.get("cookiePassword");
  return { email, password };
};

export const removeCookieCredentials = () => {
  Cookies.remove("cookieEmail");
  Cookies.remove("cookiePassword");
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(AUTH_TOKEN_KEY);
};

export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const setAuthToken = (token: string, expiresIn?: number): void => {
  const options: Cookies.CookieAttributes = {
    expires: expiresIn ? expiresIn / (60 * 60 * 24) : 7,
    secure: true,
    sameSite: "strict",
  };

  Cookies.set(AUTH_TOKEN_KEY, token, options);
};

export const setRefreshToken = (
  refreshToken: string,
  expiresIn?: number
): void => {
  const options: Cookies.CookieAttributes = {
    expires: expiresIn ? expiresIn / (60 * 60 * 24) : 7, // 7 days expiration
    secure: true,
    sameSite: "strict",
    domain: window.location.hostname,
  };

  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, options);
};

export const removeAuthToken = (): void => {
  Cookies.remove(AUTH_TOKEN_KEY);
};

export const removeRefreshToken = (): void => {
  Cookies.remove(REFRESH_TOKEN_KEY);
};
