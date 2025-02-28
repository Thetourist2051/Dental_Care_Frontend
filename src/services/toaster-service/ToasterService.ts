type ToastOptions = {
    severity?: 'success' | 'info' | 'warn' | 'error';
    summary?: string;
    detail?: string;
    life?: number;
  };
  
  class ToasterService {
    private static toast: any = null;
  
    static init(toast: any) {
      this.toast = toast;
    }
  
    static show(options: ToastOptions) {
      if (this.toast) {
        this.toast.show(options);
      }
    }
  
    static clear() {
      if (this.toast) {
        this.toast.clear();
      }
    }
  }
  
  export default ToasterService;