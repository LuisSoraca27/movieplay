/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
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
  Spinner,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addToast } from "@heroui/toast";
import { getCustomerByEmail } from "../../features/customer/customerSlice";
import getCurrentDate from "../../utils/functions/getCurrentDate";
import { createOrderInternalProfile, setOrderStatusError, setOrderStatusSuccess } from "../../features/ordersInternal/ordersIternalSlice";
import { setProfilesThunk } from "../../features/user/profileSlice";
import { setAccountsThunk } from "../../features/account/accountSlice";
import { removeError, removeSuccess } from "../../features/error/errorSlice";
import { motion, AnimatePresence } from "framer-motion";
import CardProfilePreview from "../CardProfilePreview";

function RegisterOrder({ onClose, data, typeAccountProp }) {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileSelected, setProfileSelected] = useState(null);
  const [typeAccount, setTypeAccount] = useState(typeAccountProp); // eslint-disable-line no-unused-vars
  const [options, setOptions] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      referend: "",
    },
  });

  const { profiles } = useSelector((state) => state.profiles);
  const { accounts } = useSelector((state) => state.accounts);
  const { customerByEmail } = useSelector((state) => state.customers);
  const { orderStatusError, orderStatusSuccess } = useSelector((state) => state.ordersInternal);
  const { error, success } = useSelector((state) => state.error);

  const fullNameValue = watch("fullName");
  const emailValue = watch("email");
  const phoneValue = watch("phone");
  const typeValue = watch("type");
  const referendValue = watch("referend");

  const mediosDePago = [
    { label: "Bancolombia", value: "bancolombia" },
    { label: "Nequi", value: "nequi" },
    { label: "Daviplata", value: "Daviplata" },
    { label: "Ahorro a la mano", value: "ahorro a la mano" },
    { label: "Qr Bancolombia", value: "qr bancolombia" },
    { label: "Transfiya", value: "transfiya" },
    { label: "Pse", value: "pse" },
    { label: "Binace", value: "binance" },
    { label: "PayPal", value: "paypal" },
    { label: "Wompi", value: "wompi" },
    { label: "Efectivo", value: "Efectivo" },
  ];

  const handleStatusUpdates = () => {
    if (orderStatusError) {
      addToast({ title: "Error", description: orderStatusError, color: "danger" });
      dispatch(setOrderStatusError(false));
    }
    if (orderStatusSuccess) {
      addToast({ title: "Éxito", description: orderStatusSuccess, color: "success" });
      dispatch(setOrderStatusSuccess(false));
    }
    if (error) {
      addToast({ title: "Error", description: error, color: "danger" });
      dispatch(removeError());
    }
    if (success) {
      addToast({ title: "Éxito", description: success, color: "success" });
      dispatch(removeSuccess());
    }
  };

  useEffect(() => {
    handleStatusUpdates();
  }, [orderStatusError, orderStatusSuccess, error, success]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSearchCustomerByEmail = () => {
    if (fullNameValue && phoneValue) {
      setValue("fullName", "");
      setValue("phone", "");
    }
    if (emailValue) {
      dispatch(getCustomerByEmail(emailValue));
    }
  };

  const handleSelectProfile = (e) => {
    const Id = e.target.value;
    const selected = options.find((profile) => profile.id === Id);
    setProfileSelected(selected);
  };

  const onSubmit = (formDataVal) => {
    if (!profileSelected) {
      addToast({ title: "Advertencia", description: typeAccount === "profile" ? "Seleccione un perfil" : "Seleccione una cuenta", color: "warning" });
      return;
    }

    setCurrentStep(2);

    const formData = new FormData();
    formData.append("fullName", formDataVal.fullName);
    formData.append("email", formDataVal.email);
    formData.append("phone", formDataVal.phone);
    formData.append("referend", formDataVal.referend.toLowerCase());
    formData.append("paymentMethod", formDataVal.type);
    formData.append("profileSelected", profileSelected.id);
    formData.append("typeAccount", typeAccount);
    formData.append("lastPurchaseDate", getCurrentDate());

    dispatch(createOrderInternalProfile(formData)).then((res) => {
      if (res?.error) {
        setCurrentStep(1);
      } else {
        reset();
        onClose();
        setCurrentStep(0);
      }
    }).catch(() => {
      setCurrentStep(1);
    });
  };

  useEffect(() => {
    if (customerByEmail) {
      setValue("fullName", customerByEmail.fullName);
      setValue("phone", customerByEmail.phone);
      setValue("type", customerByEmail.type);
    }
  }, [customerByEmail, setValue]);

  useEffect(() => {
    if (typeAccount === "profile") {
      dispatch(setProfilesThunk(data?.categoryName));
    } else if (typeAccount === "account") {
      dispatch(setAccountsThunk(data?.categoryName));
    }
  }, [typeAccount, data, dispatch]);

  useEffect(() => {
    if (typeAccount === "profile") {
      setOptions(profiles);
    } else if (typeAccount === "account") {
      setOptions(accounts);
    }
  }, [typeAccount, profiles, accounts]);


  useEffect(() => {
    if (!data?.open) {
      setCurrentStep(0);
      reset();
      setProfileSelected(null);
    }
  }, [data?.open, reset]);

  return (
    <Modal
      isOpen={data.total > 0 ? data.open : false}
      onOpenChange={onClose}
      placement="center"
      backdrop="blur"
      size="2xl"
      classNames={{
        base: "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2.5rem]",
        header: "border-b border-gray-100 dark:border-gray-800 p-8 pb-4",
        body: "p-8 pt-4",
        footer: "border-t border-gray-100 dark:border-gray-800 p-8 pt-4",
        closeButton: "top-6 right-6 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-transform",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            scale: 0.95,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-4">
              <div className="flex justify-between items-center pr-8">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Registrar Venta
                </h2>
              </div>
              <div className="flex gap-2">
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${currentStep >= 0 ? "bg-slate-900 dark:bg-slate-100" : "bg-slate-200 dark:bg-slate-800"}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${currentStep >= 1 ? "bg-slate-900 dark:bg-slate-100" : "bg-slate-200 dark:bg-slate-800"}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${currentStep >= 2 ? "bg-slate-900 dark:bg-slate-100" : "bg-slate-200 dark:bg-slate-800"}`} />
              </div>
            </ModalHeader>

            <ModalBody>
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col md:flex-row gap-8 items-center"
                  >
                    <div className="w-full md:w-5/12 flex flex-col items-center gap-6">
                      <div className="transform transition-transform hover:scale-105 duration-500">
                        <CardProfilePreview
                          logoUrl={data?.logoUrl}
                          displayName={data?.displayName || data?.categoryName}
                          total={data?.total}
                          backgroundType={data?.backgroundType || 'solid'}
                          backgroundColor={data?.backgroundColor || '#000000'}
                          gradientColors={data?.gradientColors || ['#000000', '#333333']}
                          gradientDirection={data?.gradientDirection || 'to bottom'}
                          logoSize={data?.logoSize || 'medium'}
                          showAvailability={true}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 text-center">{data?.displayName || data?.categoryName}</h3>
                    </div>

                    <div className="w-full md:w-7/12 flex flex-col gap-6">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">
                          Configuración de venta
                        </p>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                          Selecciona {typeAccount === "profile" ? "un perfil" : "una cuenta"}
                        </h3>
                      </div>

                      <Select
                        label="DISPONIBLES"
                        placeholder="Seleccione una opción"
                        labelPlacement="outside"
                        selectedKeys={profileSelected ? [profileSelected.id] : []}
                        onChange={handleSelectProfile}
                        variant="flat"
                        classNames={{
                          label: "text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]",
                          trigger: "h-14 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors",
                          value: "text-slate-900 dark:text-white font-bold text-base",
                        }}
                      >
                        {options.map((option) => (
                          <SelectItem key={option.id} value={option.id} textValue={option.name}>
                            <div className="flex justify-between items-center w-full gap-2">
                              <span className="font-semibold text-slate-700 dark:text-slate-200">{option.name}</span>
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                ${option.price?.toLocaleString()}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </Select>

                      <AnimatePresence>
                        {profileSelected && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30"
                          >
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Valor a cobrar</p>
                            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                              ${profileSelected.price?.toLocaleString()}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <i className="pi pi-user text-sm"></i>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Datos del Cliente</h3>
                        </div>

                        <div className="space-y-2">
                          <div className="flex gap-2 items-end">
                            <Input
                              label="CORREO ELECTRÓNICO"
                              labelPlacement="outside"
                              placeholder="cliente@ejemplo.com"
                              {...register("email", {
                                required: "Requerido",
                                validate: validateEmail
                              })}
                              isInvalid={!!errors.email}
                              errorMessage={errors.email?.message}
                              variant="flat"
                              classNames={{
                                label: "text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]",
                                input: "text-slate-900 dark:text-white font-bold text-sm",
                                inputWrapper: "h-12 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                              }}
                              className="flex-1"
                              value={emailValue}
                              onValueChange={(val) => setValue("email", val)}
                            />
                            <Button
                              isIconOnly
                              className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl h-12 w-12 mb-0"
                              variant="flat"
                              onClick={handleSearchCustomerByEmail}
                              isDisabled={!emailValue}
                            >
                              <i className="pi pi-search" />
                            </Button>
                          </div>
                        </div>

                        <Input
                          label="NOMBRE COMPLETO"
                          labelPlacement="outside"
                          placeholder="Nombre del cliente"
                          {...register("fullName", { required: "Requerido" })}
                          isInvalid={!!errors.fullName}
                          errorMessage={errors.fullName?.message}
                          variant="flat"
                          isDisabled={!!customerByEmail}
                          value={fullNameValue}
                          onValueChange={(val) => setValue("fullName", val)}
                          classNames={{
                            label: "text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]",
                            input: "text-slate-900 dark:text-white font-bold text-sm",
                            inputWrapper: "h-12 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          }}
                        />

                        <Input
                          label="TELÉFONO / WHATSAPP"
                          labelPlacement="outside"
                          placeholder="300 123 4567"
                          {...register("phone", { required: "Requerido" })}
                          isInvalid={!!errors.phone}
                          errorMessage={errors.phone?.message}
                          variant="flat"
                          isDisabled={!!customerByEmail}
                          value={phoneValue}
                          onValueChange={(val) => setValue("phone", val)}
                          classNames={{
                            label: "text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]",
                            input: "text-slate-900 dark:text-white font-bold text-sm",
                            inputWrapper: "h-12 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          }}
                        />
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                            <i className="pi pi-wallet text-sm"></i>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pago</h3>
                        </div>

                        <Select
                          label="MÉTODO DE PAGO"
                          labelPlacement="outside"
                          placeholder="Seleccione método"
                          selectedKeys={typeValue ? [typeValue] : []}
                          onChange={(e) => setValue("type", e.target.value)}
                          isInvalid={!!errors.type}
                          errorMessage={errors.type?.message}
                          variant="flat"
                          classNames={{
                            label: "text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]",
                            trigger: "h-12 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors",
                            value: "text-slate-900 dark:text-white font-bold text-sm",
                          }}
                        >
                          {mediosDePago.map((medio) => (
                            <SelectItem key={medio.value} value={medio.value} textValue={medio.label}>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-700 dark:text-slate-200 font-medium">{medio.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </Select>
                        <input type="hidden" {...register("type", { required: "Requerido" })} />

                        <Input
                          label="REFERENCIA DE PAGO"
                          labelPlacement="outside"
                          placeholder="# Ref o Comprobante"
                          {...register("referend", { required: "Requerido" })}
                          isInvalid={!!errors.referend}
                          errorMessage={errors.referend?.message}
                          variant="flat"
                          value={referendValue}
                          onValueChange={(val) => setValue("referend", val)}
                          classNames={{
                            label: "text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]",
                            input: "text-slate-900 dark:text-white font-bold text-sm",
                            inputWrapper: "h-12 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 gap-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                      <Spinner size="lg" color="primary" classNames={{ wrapper: "w-16 h-16" }} />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Procesando Venta</h3>
                      <p className="text-slate-500 font-medium">Por favor espere un momento...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </ModalBody>

            <ModalFooter className="flex justify-between items-center gap-4">
              {currentStep === 1 && (
                <Button
                  variant="light"
                  className="font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400"
                  startContent={<i className="pi pi-arrow-left" />}
                  onPress={() => setCurrentStep(0)}
                >
                  Atrás
                </Button>
              )}
              <div className="flex-1"></div> {/* Spacer to push primary button to right or keep layout balanced */}

              {currentStep === 0 && (
                <Button
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold uppercase tracking-widest text-[11px] h-12 rounded-2xl shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all px-8 w-full md:w-auto"
                  endContent={<i className="pi pi-arrow-right" />}
                  onPress={() => {
                    if (!profileSelected) {
                      toast.warn(typeAccount === "profile" ? "Seleccione un perfil" : "Seleccione una cuenta");
                      return;
                    }
                    setCurrentStep(1);
                  }}
                >
                  Continuar
                </Button>
              )}

              {currentStep === 1 && (
                <Button
                  className="bg-blue-600 text-white font-bold uppercase tracking-widest text-[11px] h-12 rounded-2xl shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all px-8 w-full md:w-auto"
                  endContent={<i className="pi pi-check" />}
                  onPress={handleSubmit(onSubmit)}
                >
                  Confirmar Venta
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default RegisterOrder;
