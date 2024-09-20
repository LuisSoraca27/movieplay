import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import getConfig from '../utils/config';
import dksoluciones from '../api/config';
import { setError, removeError, setSuccess, removeSuccess } from '../features/error/errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';


const UploadExcel = ({ show, onClose, reCharge, url }) => {

  const dispatch = useDispatch();

  const { error, success } = useSelector(state => state.error);

  const [procesing, setProcesing] = useState(false);

  const handleError = () => {
    onClose();
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
        confirmButtonText: 'Ok',
      }).then(() => {
        dispatch(removeError());
        setProcesing(false);
        reCharge();
      });
    } else if (success) {
      onClose();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: success,
        confirmButtonText: 'Ok',
      }).then(() => {
        dispatch(removeSuccess());
        setProcesing(false);
        reCharge();
      })
    }
  }

  const [archivo, setArchivo] = useState(null);

   const uploadHandler = async () => {
            setProcesing(true);
            console.log('Archivo:', archivo);
            const formData = new FormData();
            formData.append('file', archivo);
            try {
              const response = await dksoluciones.post(url, formData, getConfig());
              console.log('Respuesta del servidor:', response.data);
              dispatch(setSuccess(response.data.message));
            } catch (error) {
              console.error('Error al enviar el archivo:', error.message);
              console.error('Error en el servidor:', error.response.data);
              dispatch(setError(error.response.data.message));
            }
          }

  useEffect(() => {
    handleError();
  }, [error, success]);


  return (
    <Dialog
      header="Subir productos desde archivo Excel"
      visible={show}
      onHide={onClose}
      style={{ width: '30vw' }}
      modal
      className="p-fluid"
      footer={
        <div>
          <Button
            label="Subir"
            icon="pi pi-check"
            severity='success'
            autoFocus
            onClick={uploadHandler}
            loading={procesing}
            disabled={procesing}
          />
          </div>
      }
    >
      <div className="p-field" style={{ padding: '15px' }}>
        <label htmlFor="file" className="p-d-block">
          Subir archivo
        </label>
        <FileUpload
          name="basic"
          mode="basic"
          url="http://localhost:4002/api/v1/profile/uploadexcel"
          accept=".xlsx"
          maxFileSize={1000000} 
          chooseLabel="Subir archivo"
          onClear={() => setArchivo(null)}
          customUpload={true}
          onSelect={(e) => setArchivo(e.files[0])}
          disabled={procesing}
        />
        <small>Usar la plantilla preterminada</small>

      </div>
    </Dialog>
  );
};

export default UploadExcel;
