/* eslint-disable react/prop-types */
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import dksoluciones from "../../api/config";
import getConfig from "../../utils/config";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function PaypalButton({ amount }) {

  const navigate = useNavigate();
  const amountRef = useRef(amount);

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  
  const handleApprove = async (data, actions) => {
    try {
      const response = await dksoluciones.post("payment/capture-order", {
        orderId: data.orderID,
      }, getConfig());
      console.log("Pago exitoso:", response.data);
      navigate("/recargacompletada");
    } catch (error) {
      console.error("Error al capturar la orden:", error);
      alert("Hubo un error al procesar el pago.");
    }
  };

  const createOrder = async () => {
    const currentAmount = amountRef.current;
    if (currentAmount < 7) {
      alert("El monto mínimo es de $7.00");
      return;
    }
    try {
      const response = await dksoluciones.post(
        "payment/create-order",
        { amount: currentAmount },
        getConfig()
      );
      const { id } = response.data;
      return id;
    } catch (error) {
      console.error("Error al crear la orden:", error);
      alert("Hubo un error al crear la orden.");
    }
  };

  console.log(import.meta.env.VITE_PAYPAL_CLIENT_ID);
  

  return (
    <PayPalScriptProvider
      options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}
    >
      <PayPalButtons
        createOrder={createOrder}
        onApprove={handleApprove}
        style={{ layout: "vertical" }}
      />
    </PayPalScriptProvider>
  );
}

export default PaypalButton;
