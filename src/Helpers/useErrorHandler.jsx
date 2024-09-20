import { useDispatch } from 'react-redux';
import { removeError, removeSuccess } from '../features/error/errorSlice';

const useErrorHandler = (error, success,) => {
  const dispatch = useDispatch();

  const showSuccess = (toast, successMessage) => {
    toast.show({ severity: 'success', summary: 'Éxito', detail: successMessage, life: 2000 });
    dispatch(removeSuccess());
  };

  const showError = (toast, errorMessage) => {
    toast.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 2000 });
    dispatch(removeError());
  };

  const handleErrors = (toast) => {
    if (error) {
      showError(toast, error);
    } else if (success) {
      showSuccess(toast, success);
    }
  };

  return handleErrors;
};

export default useErrorHandler;
