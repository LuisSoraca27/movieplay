import { useDispatch } from 'react-redux';
import { removeError, removeSuccess } from '../features/error/errorSlice';
import { addToast } from "@heroui/toast";

const useErrorHandler = (error, success) => {
  const dispatch = useDispatch();

  const showSuccess = (successMessage) => {
    addToast({
      title: 'Éxito',
      description: successMessage,
      color: 'success',
      timeout: 2000
    });
    dispatch(removeSuccess());
  };

  const showError = (errorMessage) => {
    addToast({
      title: 'Error',
      description: errorMessage,
      color: 'danger',
      timeout: 2000
    });
    dispatch(removeError());
  };

  const handleErrors = () => {
    if (error) {
      showError(error);
    } else if (success) {
      showSuccess(success);
    }
  };

  return handleErrors;
};

export default useErrorHandler;
