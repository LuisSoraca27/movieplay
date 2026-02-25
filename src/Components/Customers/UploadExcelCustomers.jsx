import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import { setError, setSuccess } from "../../features/error/errorSlice";
import dksoluciones from "../../api/config";
import getConfig from "../../utils/config";
import { useDispatch, useSelector } from "react-redux";
import useErrorHandler from "../../Helpers/useErrorHandler";
import { addToast } from "@heroui/toast";
import { Upload, FileSpreadsheet, X, Check } from "lucide-react";

const UploadExcelCustomers = ({ show, onClose }) => {
  const dispatch = useDispatch();

  const { error, success } = useSelector((state) => state.error);
  const [procesing, setProcesing] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (error) {
      addToast({ title: "Error", description: error, color: "danger" });
      dispatch(setError(null));
    }
    if (success) {
      addToast({ title: "Éxito", description: success, color: "success" });
      dispatch(setSuccess(null));
    }
  }, [error, success, dispatch]);

  const uploadHandler = async () => {
    if (!archivo) {
      addToast({ title: "Advertencia", description: "Por favor selecciona un archivo primero.", color: "warning" });
      return;
    }

    setProcesing(true);
    const formData = new FormData();
    formData.append("file", archivo);
    try {
      const response = await dksoluciones.post(
        'customer/upload',
        formData,
        getConfig()
      );
      dispatch(setSuccess(response.data.message));
      onClose();
      setArchivo(null);
    } catch (error) {
      console.log(error.response?.data?.message || "Error al subir");
      dispatch(setError(error.response?.data?.message || "Error al subir el archivo"));
    }
    setProcesing(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setArchivo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Modal
        isOpen={show}
        onClose={onClose}
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
            Subir Clientes (Excel)
            <span className="text-sm font-normal text-default-500">Carga masiva de clientes desde archivo .xlsx</span>
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="flex flex-col items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
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
                  id="dropzone-file"
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
            <div className="mt-2">
              <a href="/plantilla_clientes.xlsx" download className="text-xs text-primary hover:underline flex items-center gap-1">
                <FileSpreadsheet size={12} /> Descargar plantilla ejemplo
              </a>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              color="success"
              onPress={uploadHandler}
              isLoading={procesing}
              startContent={!procesing && <Check size={18} />}
              className="font-semibold text-white"
              isDisabled={!archivo}
            >
              Subir Clientes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Assuming ToastContainer is in App or parent, but adding here just in case if not used globally correctly yet, though removing ref dependence */}
    </>
  );
};

UploadExcelCustomers.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UploadExcelCustomers;
