import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createOutlay } from "../../features/outlay/OutlaySlice";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { Check, X } from "lucide-react";

function CreateOutlay({ show, onHide, searchDate }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const mediosDePago = [
    { label: "Bancolombia", value: "bancolombia" },
    { label: "Nequi", value: "nequi" },
    { label: "Daviplata", value: "Daviplata" },
    { label: "Ahorro a la mano", value: "ahorro a la mano" },
    { label: "Transfiya", value: "transfiya" },
    { label: "Pse", value: "pse" },
    { label: "Binance", value: "binance" },
    { label: "PayPal", value: "paypal" },
    { label: "Corresponsal", value: "Corresponsal" },
    { label: "Efectivo", value: "Efectivo" },
  ];

  const typeOutlay = [
    { label: "Nómina", value: "nomina" },
    { label: "Pago a proveedores", value: "pago a proveedores" },
    { label: "Inventario", value: "inventario" },
    { label: "Otros", value: "otros" },
  ];

  const statusOutlay = [
    { label: "Pagado", value: "pagado" },
    { label: "Pendiente", value: "pendiente" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      amount: "",
      type: "",
      status: "",
      paymentMethod: "",
      referend: "",
      creationDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await dispatch(createOutlay(data, searchDate));
    setLoading(false);

    if (result?.success) {
      reset();
      onHide();
    }
  };

  const typeValue = watch("type");
  const statusValue = watch("status");
  const paymentMethodValue = watch("paymentMethod");

  return (
    <Modal
      isOpen={show}
      onClose={onHide}
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-[2rem] border border-slate-100 shadow-2xl safe-area-y",
        header: "border-b border-slate-100 py-4",
        footer: "border-t border-slate-100 py-4",
        closeButton: "hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors right-4 top-4"
      }}
    >
      <ModalContent className="bg-white">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-slate-800">Nuevo Gasto</h2>
            <span className="text-sm font-medium text-slate-500">Registra un nuevo gasto o salida de dinero</span>
          </ModalHeader>
          <ModalBody className="gap-6 py-6">
            <Input
              label="DESCRIPCIÓN"
              placeholder="Ej: Pago de servicios"
              variant="bordered"
              labelPlacement="outside"
              {...register("name", { required: "Este campo es obligatorio" })}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              classNames={{
                label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
                inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900",
                input: "text-slate-800 font-semibold"
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="MONTO"
                placeholder="0.00"
                type="number"
                variant="bordered"
                labelPlacement="outside"
                startContent={<span className="text-slate-400 font-medium">$</span>}
                {...register("amount", {
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^[0-9]+(\.[0-9]{1,2})?$/,
                    message: "Debe ser un número válido",
                  },
                })}
                isInvalid={!!errors.amount}
                errorMessage={errors.amount?.message}
                classNames={{
                  label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
                  inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900",
                  input: "text-slate-800 font-bold"
                }}
              />
              <Input
                label="FECHA"
                type="date"
                variant="bordered"
                labelPlacement="outside"
                {...register("creationDate")}
                classNames={{
                  label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
                  inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900",
                  input: "text-slate-800 font-semibold"
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="TIPO"
                placeholder="Seleccionar"
                variant="bordered"
                labelPlacement="outside"
                selectedKeys={typeValue ? [typeValue] : []}
                onSelectionChange={(keys) => setValue("type", Array.from(keys)[0])}
                isInvalid={!!errors.type}
                errorMessage={errors.type?.message}
                classNames={{
                  label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
                  trigger: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900",
                  value: "text-slate-800 font-semibold"
                }}
              >
                {typeOutlay.map((item) => (
                  <SelectItem key={item.value}>{item.label}</SelectItem>
                ))}
              </Select>
              <input type="hidden" {...register("type", { required: "Seleccione un tipo" })} />

              <Select
                label="ESTADO"
                placeholder="Seleccionar"
                variant="bordered"
                labelPlacement="outside"
                selectedKeys={statusValue ? [statusValue] : []}
                onSelectionChange={(keys) => setValue("status", Array.from(keys)[0])}
                isInvalid={!!errors.status}
                errorMessage={errors.status?.message}
                classNames={{
                  label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
                  trigger: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900",
                  value: "text-slate-800 font-semibold"
                }}
              >
                {statusOutlay.map((item) => (
                  <SelectItem key={item.value}>{item.label}</SelectItem>
                ))}
              </Select>
              <input type="hidden" {...register("status", { required: "Seleccione un estado" })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="MEDIO DE PAGO"
                placeholder="Seleccionar"
                variant="bordered"
                labelPlacement="outside"
                selectedKeys={paymentMethodValue ? [paymentMethodValue] : []}
                onSelectionChange={(keys) => setValue("paymentMethod", Array.from(keys)[0])}
                isInvalid={!!errors.paymentMethod}
                errorMessage={errors.paymentMethod?.message}
                classNames={{
                  label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
                  trigger: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900",
                  value: "text-slate-800 font-semibold"
                }}
              >
                {mediosDePago.map((item) => (
                  <SelectItem key={item.value}>{item.label}</SelectItem>
                ))}
              </Select>
              <input type="hidden" {...register("paymentMethod", { required: "Seleccione un medio de pago" })} />

              <Input
                label="REFERENCIA (OPCIONAL)"
                placeholder="Ej: REF123456"
                variant="bordered"
                labelPlacement="outside"
                {...register("referend")}
                classNames={{
                  label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
                  inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900",
                  input: "text-slate-800 font-semibold"
                }}
              />
            </div>

          </ModalBody>
          <ModalFooter>
            <Button
              variant="bordered"
              onPress={onHide}
              isDisabled={loading}
              className="border-slate-200 font-semibold text-slate-700 uppercase tracking-widest text-xs"
            >
              Cancelar
            </Button>
            <Button
              className="bg-slate-900 text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-slate-800"
              type="submit"
              isLoading={loading}
              startContent={!loading && <Check size={16} />}
            >
              Guardar Gasto
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default CreateOutlay;
