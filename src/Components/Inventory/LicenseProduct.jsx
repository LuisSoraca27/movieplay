import React, { useState } from 'react';
import ViewProduct from '../ViewProduct';
import { setLicenseThunk, deleteLicenseThunk } from '../../features/license/licenseSlice'
import { useSelector, useDispatch } from 'react-redux';
import CreateLicense from './CreateLicense';
import EditLicenses from './EditLicenses';
import { addToast } from "@heroui/toast";
import ConfirmModal from '../ui/ConfirmModal';


const LicenseProduct = () => {
    const [reload, setReload] = useState(false)
    const [show, setShow] = useState(false)
    const [dataLicense, setDataLicense] = useState({})
    const [openEdit, setOpenEdit] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const dispatch = useDispatch()
    const licenses = useSelector(state => state.licenses)
    const { error, success } = useSelector(state => state.error)

    const handleEdit = (data) => {
        setDataLicense(data)
        setOpenEdit(true)
    }

    const handleDeleteClick = (id) => {
        setDeleteId(id)
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = () => {
        if (deleteId) {
            dispatch(deleteLicenseThunk(deleteId))
                .then(() => {
                    addToast({ title: 'Éxito', description: "Licencia eliminada correctamente", color: 'success' })
                    setReload(!reload)
                })
                .finally(() => {
                    setIsDeleteModalOpen(false)
                    setDeleteId(null)
                })
        }
    }

    React.useEffect(() => {
        dispatch(setLicenseThunk())
    }, [dispatch, reload])


    React.useEffect(() => {
        if (error) addToast({ title: 'Error', description: error, color: 'danger' })
        if (success) addToast({ title: 'Éxito', description: success, color: 'success' })
    }, [error, success])


    return (
        <>
            <CreateLicense
                show={show}
                onClose={() => setShow(false)}
                reCharge={() => setReload(!reload)}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Eliminar Licencia"
                message="¿Estás seguro de que deseas eliminar esta licencia? Esta acción no se puede deshacer."
                confirmColor="danger"
            />

            <ViewProduct
                products={licenses}
                handleDelete={handleDeleteClick}
                isEdit={true}
                setShow={setShow}
                handleEdit={handleEdit}
                reCharge={() => setReload(!reload)}
            />
            <EditLicenses
                show={openEdit}
                onClose={() => setOpenEdit(false)}
                reCharge={() => setReload(!reload)}
                dataLicense={dataLicense}
            />
        </>
    );
};

export default LicenseProduct;