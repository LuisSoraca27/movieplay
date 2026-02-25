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

function DetailOrderInternal({ showModal, handleClose, data }) {
  const productDetails = data?.productDetails;

  const formatValue = (value, fallback = "—") => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === "string" && value.trim().toLowerCase() === "null") return fallback;
    return value;
  };

  const renderDetails = () => {
    if (productDetails && productDetails.id?.startsWith("profile")) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-1 bg-indigo-500 rounded-full"></div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Perfil Entregado
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
              <span className="text-sm font-bold text-slate-800">
                {formatValue(productDetails.profileAccount, "Sin perfil")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pin</span>
              <span className="text-sm font-mono text-slate-800 bg-slate-200 px-2 rounded">
                {formatValue(productDetails.pincodeAccount, "Sin PIN")}
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
              Cuenta Entregada
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
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contraseña</span>
              <span className="text-sm font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-100">
                {decrypt(productDetails.passwordAccount)}
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
              Combo Entregado
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
    if (!data) return;

    const doc = new jsPDF("p", "pt", "a4");
    const marginX = 40;
    let y = 50;

    const safe = (value, fb) => formatValue(value, fb);

    doc.setFontSize(18);
    doc.text("Reporte de compra interna", marginX, y);
    y += 20;

    doc.setFontSize(11);
    doc.text(`ID de compra: #${data.id}`, marginX, y); y += 16;
    doc.text(
      `Fecha: ${data.createdAt ? new Date(data.createdAt).toLocaleString("es-ES") : "-"}`,
      marginX,
      y
    );
    y += 24;

    // Datos del cliente
    doc.setFontSize(12);
    doc.text("Cliente", marginX, y); y += 14;
    doc.setFontSize(10);
    doc.text(`Nombre: ${safe(data?.customer?.fullName, "Desconocido")}`, marginX, y); y += 12;
    doc.text(`Correo: ${safe(data?.customer?.email, "Sin correo")}`, marginX, y); y += 12;
    doc.text(
      `Método de pago: ${safe(data?.paymentMethod, "Sin registrar")}`,
      marginX,
      y
    );
    y += 12;
    doc.text(
      `Referencia de pago: ${safe(data?.paymentReference, "Sin referencia")}`,
      marginX,
      y
    );
    y += 20;

    // Datos del producto
    doc.setFontSize(12);
    doc.text("Producto", marginX, y); y += 14;
    doc.setFontSize(10);

    const productName =
      productDetails?.name || productDetails?.combo?.name || "Producto sin nombre";
    doc.text(`Nombre: ${productName}`, marginX, y); y += 12;
    if (data.priceProduct) {
      doc.text(`Precio: $${Number(data.priceProduct).toLocaleString("es-CO")}`, marginX, y);
      y += 12;
    }

    // Credenciales para perfiles / cuentas
    if (productDetails && (productDetails.id?.startsWith("profile") || productDetails.id?.startsWith("account"))) {
      y += 10;
      doc.setFontSize(12);
      doc.text("Credenciales entregadas", marginX, y); y += 14;
      doc.setFontSize(10);

      const email = productDetails.emailAccount ? decrypt(productDetails.emailAccount) : null;
      const password = productDetails.passwordAccount ? decrypt(productDetails.passwordAccount) : null;
      const profileAcc = safe(productDetails.profileAccount, "Sin perfil");
      const pin = safe(productDetails.pincodeAccount, "Sin PIN");

      if (email) {
        doc.text(`Correo: ${email}`, marginX, y); y += 12;
      }
      if (password) {
        doc.text(`Contraseña: ${password}`, marginX, y); y += 12;
      }
      if (productDetails.id?.startsWith("profile")) {
        doc.text(`Perfil: ${profileAcc}`, marginX, y); y += 12;
        doc.text(`PIN: ${pin}`, marginX, y); y += 12;
      }
    }

    // Detalle de combos
    if (productDetails && productDetails.combo?.id?.startsWith("combo")) {
      const { profiles = [], accounts = [] } = productDetails;

      y += 10;
      doc.setFontSize(12);
      doc.text("Detalle de combo", marginX, y); y += 14;
      doc.setFontSize(10);

      if (profiles.length > 0) {
        doc.text("Perfiles:", marginX, y); y += 12;
        profiles.forEach((p) => {
          doc.text(
            `• ${p.name} - $${Number(p.price).toLocaleString("es-CO")}`,
            marginX + 10,
            y
          );
          y += 12;
        });
      }

      if (accounts.length > 0) {
        y += 6;
        doc.text("Cuentas:", marginX, y); y += 12;
        accounts.forEach((a) => {
          doc.text(
            `• ${a.name} - $${Number(a.price).toLocaleString("es-CO")}`,
            marginX + 10,
            y
          );
          y += 12;
        });
      }
    }

    doc.save(`reporte_compra_${data.id}.pdf`);
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
        {(onClose) => (
          <>
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
              <div className="grid grid-cols-1 gap-4 text-sm bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Producto</span>
                  <span className="text-sm font-bold text-slate-800">
                    {data?.productDetails?.name || data?.productDetails?.combo?.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Usuario</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {data?.customer?.fullName?.charAt(0) || "?"}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 truncate">
                        {data?.customer?.fullName || "Desconocido"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha</span>
                    <span className="text-sm font-semibold text-slate-700">
                      {data?.createdAt && new Date(data.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correo</span>
                  <span className="text-xs font-mono text-slate-600 break-all">
                    {data?.customer?.email || "Desconocido"}
                  </span>
                </div>
              </div>

              <Divider className="my-2 border-slate-100" />

              {renderDetails()}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
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
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DetailOrderInternal;
