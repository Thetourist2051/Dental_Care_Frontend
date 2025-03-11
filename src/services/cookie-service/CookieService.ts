import Cookies from "js-cookie";

export const SaveCredentialstoCookie = (email: string, password: string) => {
  Cookies.set("cookieEmail", email, { expires: 7 });
  Cookies.set("cookiePassword", password, { expires: 7 });
};

export const GetCookieCredentails = () => {
  const email = Cookies.get("cookieEmail");
  const password = Cookies.get("cookiePassword");
  return { email, password };
};


export const removeCookieCredentials = () =>{
    Cookies.remove('cookieEmail');
    Cookies.remove('cookiePassword');
}
