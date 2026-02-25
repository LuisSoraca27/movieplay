/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import dksoluciones from "../../api/config";
import getConfig from "../../utils/config";

const WompiCheckout = ({ amount }) => {

  const user = JSON.parse(localStorage.getItem("user"));

  const [reference, setReference] = useState("");
  const [signature, setSignature] = useState("");

  const getReferenceAndSignature = async () => {
    try {
      const { data } = await dksoluciones.post("/payment/getReferendAndSignature", { cant: amount }, getConfig());
      return { reference: data.reference, signature: data.signature };
    } catch (error) {
      console.error("Error fetching reference and signature:", error);
      return { reference: "", signature: "" };
    }
  };

  const registerRecharge = async () => {
    try {
      const res = await dksoluciones.post("payment/registertransaction", { amount, reference }, getConfig());
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { reference, signature } = await getReferenceAndSignature();
      setReference(reference);
      setSignature(signature);
    };
    fetchData();
  }, [amount]);

  const handlePayment = () => {
    if (!window.WidgetCheckout) {
      console.error("WidgetCheckout is not loaded");
      return;
    }

    if(amount < 30000) {
      alert("El monto mínimo para recargar con Wompi es de 30,000 COP.");
      return;
    }

    registerRecharge();

    const checkout = new window.WidgetCheckout({
      currency: "COP",
      amountInCents: amount * 100, // Convirtiendo a centavos
      reference,
      signature: {integrity : signature},
      publicKey: import.meta.env.VITE_WOMPI_PUBLIC_KEY,
      redirectUrl: "http://localhost:5173/mi-perfil",
      customerData: {
        email: user.email,
      }
    },
    
  );

    checkout.open((result) => {
      console.log("Resultado del pago:", result);
    });
  };

  return (
    <div>
      <Button
        label="Recargar con Wompi"
        className="p-button-raised"
        onClick={handlePayment}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default WompiCheckout;
