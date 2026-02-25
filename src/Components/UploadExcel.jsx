import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { useEffect, useState, useRef } from 'react';
import getConfig from '../utils/config';
import dksoluciones from '../api/config';
import { setError, removeError, setSuccess, removeSuccess } from '../features/error/errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addToast } from "@heroui/toast";
import { Upload, FileSpreadsheet, Download, X, Check } from 'lucide-react';

const UploadExcel = ({ show, onClose, reCharge, url, title = "Subir productos desde archivo Excel", templateEndpoint }) => {
  const dispatch = useDispatch();
  const { error, success } = useSelector(state => state.error);
  const [procesing, setProcesing] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (error) {
      addToast({ title: "Error", description: error, color: "danger" });
      dispatch(removeError());
      setProcesing(false);
      reCharge?.();
    }
    if (success) {
      addToast({ title: "Éxito", description: success, color: "success" });
      dispatch(removeSuccess());
      setProcesing(false);
      reCharge?.();
      handleClose();
    }
  }, [error, success]);

  const handleClose = () => {
    setArchivo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const uploadHandler = async () => {
    if (!archivo) {
      addToast({ title: "Advertencia", description: "Por favor selecciona un archivo primero.", color: "warning" });
      return;
    }

    setProcesing(true);
    const formData = new FormData();
    formData.append('file', archivo);
    try {
      const response = await dksoluciones.post(url, formData, getConfig());
      dispatch(setSuccess(response.data.message));
    } catch (error) {
      console.log(error.response?.data?.message);
      dispatch(setError(error.response?.data?.message || "Error al subir el archivo"));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1000000) {
        addToast({ title: "Error", description: "El archivo es muy grande. Máximo 1MB", color: "danger" });
        return;
      }
      setArchivo(file);
    }
  };

  const clearFile = () => {
    setArchivo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await dksoluciones.get(templateEndpoint, {
        responseType: "blob",
      });
      const contentDisposition = response.headers['content-disposition'];
      const match = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const fileName = match ? match[1] : 'plantilla.xlsx';

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      addToast({ title: "Error", description: "No se pudo descargar la plantilla.", color: "danger" });
    }
  };

  return (
    <Modal
      isOpen={show}
      onClose={handleClose}
      backdrop="blur"
      motionProps={{
        variants: {
          enter: { y: 0, opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
          exit: { y: -20, opacity: 0, transition: { duration: 0.1, ease: "easeIn" } },
        }
      }}
      classNames={{
        base: "bg-white dark:bg-[#1C1D1F] border border-gray-200 dark:border-gray-800",
        header: "border-b border-gray-200 dark:border-gray-800",
        footer: "border-t border-gray-200 dark:border-gray-800",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {title}
          <span className="text-sm font-normal text-default-500">Carga masiva desde archivo .xlsx</span>
        </ModalHeader>
        <ModalBody className="py-6">
          <div className="flex flex-col items-center justify-center w-full">
            <label
              htmlFor="upload-excel-file"
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${archivo ? 'border-success-500 bg-success-50 dark:bg-success-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {archivo ? (
                  <>
                    <FileSpreadsheet className="w-10 h-10 mb-3 text-success-500" />
                    <p className="mb-2 text-sm text-gray-900 dark:text-white font-semibold">{archivo.name}</p>
                    <p className="text-xs text-gray-500">{(archivo.size / 1024).toFixed(2)} KB</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click para subir</span> o arrastra</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">XLSX (Max. 1MB)</p>
                  </>
                )}
              </div>
              <input
                id="upload-excel-file"
                type="file"
                className="hidden"
                accept=".xlsx"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label>
            {archivo && (
              <Button
                color="danger"
                variant="flat"
                size="sm"
                startContent={<X size={14} />}
                className="mt-2"
                onPress={clearFile}
              >
                Remover archivo
              </Button>
            )}
          </div>
          {templateEndpoint && (
            <div className="mt-2">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download size={12} /> Descargar plantilla ejemplo
              </button>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancelar
          </Button>
          <Button
            color="success"
            onPress={uploadHandler}
            isLoading={procesing}
            startContent={!procesing && <Check size={18} />}
            className="font-semibold text-white"
            isDisabled={!archivo || procesing}
          >
            Subir
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadExcel;
