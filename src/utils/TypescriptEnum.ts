export interface TypescriptEnum {
  TabTypes: "Home" | "About" | "Service";
}

export interface RouteInterface {
  path: string;
  element: React.ReactNode;
  modulename?: string;
  id?: any;
  moduleicon?: string;
}
