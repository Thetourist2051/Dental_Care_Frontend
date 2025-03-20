import { BehaviorSubject } from "rxjs";

export const GlobalService = {
  userInfo: new BehaviorSubject<any>(null),
};
