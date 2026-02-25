/* eslint-disable react/prop-types */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@heroui/react";
import { Download, X, ShoppingBag } from "lucide-react";
import { jsPDF } from "jspdf";
import decrypt from "../../Helpers/decrypt";

const Detailorder = ({ showModal, handleClose, data }) => {
  const productDetails = data?.productDetails;

  const renderDetails = () => {
    if (productDetails && productDetails.id?.startsWith("profile")) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-1 bg-indigo-500 rounded-full"></div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              PERFIL ENTREGADO
            </h4>
          </div>
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nombre</span>
              <span className="text-sm font-bold text-slate-800">{productDetails.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Descripción</span>
              <span className="text-sm font-semibold text-slate-700">{productDetails.description}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Precio</span>
              <span className="text-sm font-bold text-emerald-600">${productDetails.price}</span>
            </div>
            <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Correo</span>
              <span className="text-sm font-mono text-slate-700 break-all bg-white px-2 py-1 rounded border border-slate-100">
                {decrypt(productDetails.emailAccount)}
              </span>
            </div>
            <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contraseña</span>
              <span className="text-sm font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-100">
                {decrypt(productDetails.passwordAccount)}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Perfil</span>
              <span className="text-sm font-bold text-slate-800">{productDetails.profileAccount}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pin</span>
              <span className="text-sm font-mono text-slate-800 bg-slate-200 px-2 rounded">{productDetails.pincodeAccount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Creación</span>
              <span className="text-sm font-semibold text-slate-600">
                {new Date(productDetails.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      );
    } else if (productDetails && productDetails.id?.startsWith("account")) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-1 bg-purple-500 rounded-full"></div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              CUENTA ENTREGADA
            </h4>
          </div>
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nombre</span>
              <span className="text-sm font-bold text-slate-800">{productDetails.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Descripción</span>
              <span className="text-sm font-semibold text-slate-700">{productDetails.description}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Precio</span>
              <span className="text-sm font-bold text-emerald-600">${productDetails.price}</span>
            </div>
            <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Correo</span>
              <span className="text-sm font-mono text-slate-700 break-all bg-white px-2 py-1 rounded border border-slate-100">
                {decrypt(productDetails.emailAccount)}
              </span>
            </div>
            <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contraseña</span>
              <span className="text-sm font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-100">
                {decrypt(productDetails.passwordAccount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Creación</span>
              <span className="text-sm font-semibold text-slate-600">
                {new Date(productDetails.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      );
    } else if (
      productDetails &&
      productDetails?.combo?.id?.startsWith("combo")
    ) {
      const { profiles, accounts } = productDetails;

      return (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-1 bg-pink-500 rounded-full"></div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              COMBO ENTREGADO
            </h4>
          </div>

          {profiles && profiles.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider pl-1">Perfiles</h5>
              {profiles.map((profile, index) => (
                <div key={`profile-${index}`} className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-slate-700">{profile.name}</span>
                    <span className="text-xs font-bold text-emerald-600">${profile.price}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Correo</span>
                      <span className="font-mono text-slate-600 bg-white px-2 py-1 rounded border border-indigo-100">{decrypt(profile.emailAccount)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Contraseña</span>
                      <span className="font-mono text-slate-600 bg-white px-2 py-1 rounded border border-indigo-100">{decrypt(profile.passwordAccount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {accounts && accounts.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-purple-500 uppercase tracking-wider pl-1">Cuentas</h5>
              {accounts.map((account, index) => (
                <div key={`account-${index}`} className="bg-purple-50/50 rounded-xl p-3 border border-purple-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-slate-700">{account.name}</span>
                    <span className="text-xs font-bold text-emerald-600">${account.price}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Correo</span>
                      <span className="font-mono text-slate-600 bg-white px-2 py-1 rounded border border-purple-100">{decrypt(account.emailAccount)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Contraseña</span>
                      <span className="font-mono text-slate-600 bg-white px-2 py-1 rounded border border-purple-100">{decrypt(account.passwordAccount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de Compra", 20, 20);
    doc.setFontSize(12);

    doc.text(`N° de Compra: ${data.id}`, 20, 40);
    doc.text(`Producto: ${data.nameProduct}`, 20, 50);
    doc.text(`Precio: $${data.priceProduct}`, 20, 60);
    doc.text(
      `Fecha de Compra: ${new Date(data.createdAt).toLocaleString()}`,
      20,
      70
    );
    doc.text(`Usuario: ${data.username}`, 20, 80);

    if (productDetails) {
      doc.text("Detalles del Producto:", 20, 100);

      if (productDetails.combo?.id.startsWith("combo")) {
        let yPosition = 110;

        const { profiles, accounts } = productDetails;

        profiles && doc.text("Perfiles:", 20, yPosition);
        yPosition += 10;
        profiles.forEach((profile) => {
          doc.text(`Nombre: ${profile.name}`, 20, yPosition);
          yPosition += 10;
          doc.text(`Precio: ${profile.price}`, 20, yPosition);
          yPosition += 10;
        });

        accounts && doc.text("Cuentas:", 20, yPosition);
        yPosition += 10;
        accounts.forEach((account) => {
          doc.text(`Nombre: ${account.name}`, 20, yPosition);
          yPosition += 10;
          doc.text(`Precio: ${account.price}`, 20, yPosition);
        });
      }
    }

    doc.save(`factura_${data.id}.pdf`);
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={handleClose}
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: "bg-white border border-slate-200 shadow-2xl rounded-[2.5rem]",
        header: "border-b border-slate-100 p-6 pb-2",
        body: "p-6 overflow-y-auto custom-scrollbar",
        footer: "border-t border-slate-100 p-6 pt-2"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
              <ShoppingBag size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">Detalles</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID COMPRA: #{data?.id}</span>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-4 text-sm bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Producto</span>
                <span className="text-sm font-bold text-slate-800">
                  {data?.nameProduct}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Usuario</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {data?.username?.charAt(0) || "?"}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 truncate">
                      {data?.username || "Desconocido"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio</span>
                  <span className="text-sm font-bold text-emerald-600">
                    ${data?.priceProduct}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha de Compra</span>
                <span className="text-sm font-semibold text-slate-700">
                  {data?.createdAt && new Date(data.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <Divider className="my-2 border-slate-100" />
            {renderDetails()}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onPress={handleClose}
            startContent={<X size={16} />}
            className="font-bold text-slate-500 uppercase tracking-wider text-[11px]"
          >
            Cerrar
          </Button>
          <Button
            className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] shadow-lg"
            onPress={handleDownloadInvoice}
            startContent={<Download size={16} />}
          >
            Descargar Reporte
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Detailorder;
