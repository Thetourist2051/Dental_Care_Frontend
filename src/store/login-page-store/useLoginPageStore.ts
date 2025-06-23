import { create } from "zustand";
import { UserInterface } from "../../utils/enum-dictionary/UserInterface/UserInteface";

interface LoginPageStoreState {
  userInfo: UserInterface | null;
  setUserInfo: (userInfo: UserInterface | null) => void;
}

export const useLoginPageStore = create<LoginPageStoreState>((set) => ({
  userInfo: null,

  setUserInfo: (userInfo: UserInterface | null) => {
    set({ userInfo: userInfo });
  },

}));
