import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Autocomplete, AutocompleteItem, Select, SelectItem } from "@heroui/react";
import { createUserThunk } from "../features/user/userSlice";
import { useDispatch } from "react-redux";
import { addToast } from "@heroui/toast";
import { UserPlus, Mail, Lock, Phone, Globe, Shield, Check, X } from 'lucide-react';

// eslint-disable-next-line react/prop-types
const ModalCreateUser = ({ open, onClose }) => {
  const initialData = {
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "seller", // Default role
    country: "",
  };

  const countries = [
    { name: "Afganistán", code: "AF" },
    { name: "Alemania", code: "DE" },
    { name: "Arabia Saudita", code: "SA" },
    { name: "Argentina", code: "AR" },
    { name: "Australia", code: "AU" },
    { name: "Bélgica", code: "BE" },
    { name: "Bolivia", code: "BO" },
    { name: "Brasil", code: "BR" },
    { name: "Canadá", code: "CA" },
    { name: "Chile", code: "CL" },
    { name: "China", code: "CN" },
    { name: "Colombia", code: "CO" },
    { name: "Corea del Sur", code: "KR" },
    { name: "Costa Rica", code: "CR" },
    { name: "Cuba", code: "CU" },
    { name: "Dinamarca", code: "DK" },
    { name: "Ecuador", code: "EC" },
    { name: "Egipto", code: "EG" },
    { name: "El Salvador", code: "SV" },
    { name: "España", code: "ES" },
    { name: "Estados Unidos", code: "US" },
    { name: "Francia", code: "FR" },
    { name: "Grecia", code: "GR" },
    { name: "Guatemala", code: "GT" },
    { name: "Honduras", code: "HN" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "ID" },
    { name: "Irán", code: "IR" },
    { name: "Irlanda", code: "IE" },
    { name: "Israel", code: "IL" },
    { name: "Italia", code: "IT" },
    { name: "Japón", code: "JP" },
    { name: "México", code: "MX" },
    { name: "Nicaragua", code: "NI" },
    { name: "Noruega", code: "NO" },
    { name: "Panamá", code: "PA" },
    { name: "Paraguay", code: "PY" },
    { name: "Perú", code: "PE" },
    { name: "Portugal", code: "PT" },
    { name: "Reino Unido", code: "GB" },
    { name: "Rusia", code: "RU" },
    { name: "Suecia", code: "SE" },
    { name: "Suiza", code: "CH" },
    { name: "Uruguay", code: "UY" },
    { name: "Venezuela", code: "VE" },
    { name: "Otro", code: "OT" },
  ];

  const [dataUser, setDataUser] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleCountryChange = (key) => {
    // key is the 'name' because used as key in AutocompleteItem
    setDataUser({ ...dataUser, country: key });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataUser({
      ...dataUser,
      [name]: value,
    });
  };

  const handleRoleChange = (e) => {
    setDataUser({
      ...dataUser,
      role: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(createUserThunk(dataUser));
    setLoading(false);

    if (result?.success) {
      onClose();
      setDataUser(initialData);
      addToast({ title: "Éxito", description: result.message || "Usuario creado exitosamente", color: "success" });
    } else {
      addToast({ title: "Error", description: result?.message || "Error al crear usuario", color: "danger" });
    }
  };

  const inputClasses = {
    label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
    inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white",
    input: "text-slate-800 font-semibold",
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="2xl"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-[2rem] border border-slate-100 shadow-2xl bg-white",
        header: "border-b border-slate-100 py-6 px-8",
        body: "py-8 px-8",
        footer: "border-t border-slate-100 py-6 px-8",
        closeButton: "hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors right-4 top-4"
      }}
    >
      <ModalContent className="overflow-hidden">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-800">
                  <UserPlus size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Crear Nuevo Usuario</h2>
              </div>
              <p className="text-sm font-medium text-slate-500 pl-11">
                Complete la información para registrar un nuevo usuario en el sistema.
              </p>
            </ModalHeader>
            <ModalBody>
              <form id="create-user-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full md:col-span-1">
                  <Input
                    autoFocus
                    label="NOMBRE DE USUARIO"
                    labelPlacement="outside"
                    placeholder="Ej: juanperez"
                    name="username"
                    value={dataUser.username}
                    onChange={handleChange}
                    startContent={<UserPlus size={16} className="text-slate-400" />}
                    variant="bordered"
                    isRequired
                    classNames={inputClasses}
                  />
                </div>
                <div className="col-span-full md:col-span-1">
                  <Input
                    type="email"
                    label="CORREO ELECTRÓNICO"
                    labelPlacement="outside"
                    placeholder="juan@ejemplo.com"
                    name="email"
                    value={dataUser.email}
                    onChange={handleChange}
                    startContent={<Mail size={16} className="text-slate-400" />}
                    variant="bordered"
                    isRequired
                    classNames={inputClasses}
                  />
                </div>
                <div className="col-span-full md:col-span-1">
                  <Input
                    type="password"
                    label="CONTRASEÑA"
                    labelPlacement="outside"
                    placeholder="••••••••"
                    name="password"
                    value={dataUser.password}
                    onChange={handleChange}
                    startContent={<Lock size={16} className="text-slate-400" />}
                    variant="bordered"
                    isRequired
                    classNames={inputClasses}
                  />
                </div>
                <div className="col-span-full md:col-span-1">
                  <Input
                    type="tel"
                    label="WHATSAPP / TELÉFONO"
                    labelPlacement="outside"
                    placeholder="300 123 4567"
                    name="phone"
                    value={dataUser.phone}
                    onChange={handleChange}
                    startContent={<Phone size={16} className="text-slate-400" />}
                    variant="bordered"
                    isRequired
                    classNames={inputClasses}
                  />
                </div>

                <div className="col-span-full md:col-span-1">
                  <Autocomplete
                    label="PAÍS"
                    labelPlacement="outside"
                    placeholder="Seleccione un país"
                    variant="bordered"
                    startContent={<Globe size={16} className="text-slate-400" />}
                    onSelectionChange={handleCountryChange}
                    selectedKey={dataUser.country}
                    isRequired
                    inputProps={{
                      classNames: inputClasses
                    }}
                  >
                    {countries.map((country) => (
                      <AutocompleteItem key={country.name} textValue={country.name}>
                        <div className="flex gap-2 items-center">
                          <img
                            alt={country.name}
                            src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                            className="w-5 h-4 object-cover rounded-sm shadow-sm"
                          />
                          <span>{country.name}</span>
                        </div>
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>

                <div className="col-span-full md:col-span-1">
                  <Select
                    label="ROL DEL USUARIO"
                    labelPlacement="outside"
                    placeholder="Seleccione un rol"
                    name="role"
                    selectedKeys={dataUser.role ? [dataUser.role] : []}
                    onChange={handleRoleChange}
                    startContent={<Shield size={16} className="text-slate-400" />}
                    variant="bordered"
                    isRequired
                    classNames={inputClasses}
                  >
                    <SelectItem key="seller" value="seller">Vendedor</SelectItem>
                    <SelectItem key="admin" value="admin">Administrador</SelectItem>
                  </Select>
                </div>
              </form>
            </ModalBody>
            <ModalFooter className="flex justify-between items-center bg-white">
              <Button
                variant="bordered"
                onPress={onClose}
                className="border-slate-200 font-semibold text-slate-700 uppercase tracking-widest text-xs h-10 px-6 rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="create-user-form"
                isLoading={loading}
                isDisabled={loading}
                startContent={!loading && <Check size={16} />}
                className="bg-slate-900 text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-slate-800 h-10 px-6 rounded-xl"
              >
                Crear Usuario
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalCreateUser;
