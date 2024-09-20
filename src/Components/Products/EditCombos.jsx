import React, { useState, useEffect } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { editComboThunk } from '../../features/user/comboSlice';
import {removeError, removeSuccess } from '../../features/error/errorSlice';

const EditCombos = ({ data, show, onClose, reCharge }) => {
  const { profileInCombos } = data;
  const profilesMap = profileInCombos?.map((profileInCombo) => {
    return profileInCombo.profile;
  });

  console.log(profilesMap);

  const dispatch = useDispatch();
  const { success, error } = useSelector((state) => state.error);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [profiles, setProfiles] = useState([]);
  const [procesing, setProcesing] = useState(false);

  const handleErrors = () => {
    if (success) {
      Swal.fire({
        title: 'Combo editado correctamente',
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      dispatch(removeSuccess());
      onClose();
      reCharge();
    }
    if (error) {
      Swal.fire({
        title: 'Error al editar el combo',
        text: error,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      dispatch(removeError());
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    setProcesing(true);
    e.preventDefault();
    const dataForm = {
      name: form.name,
      description: form.description,
      price: form.price,
      profiles,
    };
    dispatch(editComboThunk(data.id, dataForm)).then(() => {
      setForm({
        name: '',
        description: '',
        price: '',
      });
      setProfiles([]);
      onClose();
      reCharge();
      setProcesing(false);
    });
  };

  useEffect(() => {
    handleErrors();
    if (data) {
      setForm({
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
      });
      setProfiles(profilesMap);
    }
  }, [data, success, error]);

  return (
    <Dialog
      visible={show}
      onHide={onClose}
      style={{ width: '80vw' }}
      header="Editar Cuenta"
      footer={
        <div>
          <Button
            label="Editar"
            className="p-button-success"
            loading={procesing}
            icon="pi pi-check"
            onClick={handleSubmit}
            disabled={procesing}
            autoFocus
          />
        </div>
      }
    >
      <div className="container-form-combos">
        <div className="colum-form-1">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ width: '100%', marginBottom: '20px' }}>
              <label className="style-label">Nombre</label>
              <InputText
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ width: '100%', marginBottom: '20px' }}>
              <label className="style-label">Descripción</label>
              <InputTextarea
                rows={3}
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ width: '100%', marginBottom: '20px' }}>
              <label className="style-label">Precio</label>
              <InputText
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </div>

          </form>
        </div>
        <div className="colum-form-2">
          {profiles &&
            profiles.map((profile, index) => (
              <Accordion key={index} >
                <AccordionTab
                  header={profile.name}
                >
                     <div>
                    <label className="style-label">Nombre</label>
                    <InputText
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={(e) => {
                        const perfilesActualizados = [...profiles];
                        perfilesActualizados[index] = {
                          ...perfilesActualizados[index],
                          [e.target.name]: e.target.value,
                        };
                        setProfiles(perfilesActualizados);
                      }}
                      style={{ width: '100%' }}
                    />
                </div>
                <br />
                <div>
                    <label className="style-label">Descripción</label>
                    <InputTextarea
                      rows={3}
                      type="text"
                      name="description"
                      value={profile.description}
                      onChange={(e) => {
                        const perfilesActualizados = [...profiles];
                        perfilesActualizados[index] = {
                          ...perfilesActualizados[index],
                          [e.target.name]: e.target.value,
                        };
                        setProfiles(perfilesActualizados);
                      }}
                      style={{ width: '100%' }}
                    />
                </div>
                <br />
                <div>
                    <label className="style-label">Precio</label>
                    <InputText
                      type="number"
                      name="price"
                      value={profile.price}
                      onChange={(e) => {
                        const perfilesActualizados = [...profiles];
                        perfilesActualizados[index] = {
                          ...perfilesActualizados[index],
                          [e.target.name]: e.target.value,
                        };
                        setProfiles(perfilesActualizados);
                      }}
                      style={{ width: '100%' }}
                    />
                </div>
                <br />
                <div>
                    <label>Correo de cuenta</label>
                    <InputText
                      type="text"
                      name="emailAccount"
                      value={profile.emailAccount}
                      onChange={(e) => {
                        const perfilesActualizados = [...profiles];
                        perfilesActualizados[index] = {
                          ...perfilesActualizados[index],
                          [e.target.name]: e.target.value,
                        };
                        setProfiles(perfilesActualizados);
                      }}
                      style={{ width: '100%' }}
                    />
                </div>
                <br />
                <div>
                    <label>Contraseña de cuenta</label>
                    <InputText
                      type="text"
                      name="passwordAccount"
                      value={profile.passwordAccount}
                      onChange={(e) => {
                        const perfilesActualizados = [...profiles];
                        perfilesActualizados[index] = {
                          ...perfilesActualizados[index],
                          [e.target.name]: e.target.value,
                        };
                        setProfiles(perfilesActualizados);
                      }}
                      style={{ width: '100%' }}
                    />
                </div>
                <br />
                <div>
                    <label>Perfil de cuenta</label>
                    <InputText
                      type="text"
                      name="profileAccount"
                      value={profile.profileAccount}
                      onChange={(e) => {
                        const perfilesActualizados = [...profiles];
                        perfilesActualizados[index] = {
                          ...perfilesActualizados[index],
                          [e.target.name]: e.target.value,
                        };
                        setProfiles(perfilesActualizados);
                      }}
                      style={{ width: '100%' }}
                    />
                </div>
                <br />
                <div>
                    <label>Pin de cuenta</label>
                    <InputText
                      type="text"
                      name="pincodeAccount"
                      value={profile.pincodeAccount}
                      onChange={(e) => {
                        const perfilesActualizados = [...profiles];
                        perfilesActualizados[index] = {
                          ...perfilesActualizados[index],
                          [e.target.name]: e.target.value,
                        };
                        setProfiles(perfilesActualizados);
                      }}
                      style={{ width: '100%' }}
                    />
                </div>
                </AccordionTab>
              </Accordion>
            ))}
        </div>
      </div>
    </Dialog>
  );
};

export default EditCombos;
