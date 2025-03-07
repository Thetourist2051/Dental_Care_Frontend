import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Toast } from 'primereact/toast';
import ToasterService from '../../services/toaster-service/ToasterService';

const Toaster = forwardRef((props,ref) => {
  console.log(props)
  const toastRef = useRef<Toast>(null);

  useImperativeHandle(ref, () => ({
    show: (options: any) => toastRef.current?.show(options),
    clear: () => toastRef.current?.clear(),
  }));

  useEffect(() => {
    if (toastRef.current) {
      ToasterService.init(toastRef.current);
    }
  }, []);

  return <Toast ref={toastRef} />;
});

export default Toaster;