import React from 'react';
import ViewProduct from '../ViewProduct';
import { setLicenseThunk, deleteLicenseThunk } from '../../features/license/licenseSlice'
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import CreateLicense from './CreateLicense';
import EditProfile from './EditProfile';
import EditLicenses from './EditLicenses';


const LicenseProduct = () => {

    const [reload, setReload] = React.useState(false)
    const [show, setShow] = React.useState(false)

    const [dataLicense, setDataLicense] = React.useState({})
    const [openEdit, setOpenEdit] = React.useState(false)

    const dispatch = useDispatch()
    const licenses = useSelector(state => state.licenses)


    const handleEdit = (data) => {
        setDataLicense(data)
        setOpenEdit(true)
    }

    const handleDelete = (id) => {
        console.log(id)
        Swal.fire({
            title: '¿Estas seguro?',
            text: "No podras revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '!Si, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteLicenseThunk(id))
                    .finally(() => {
                        Swal.fire(
                            'Eliminado!',
                            'El Perfil ha sido eliminado.',
                            'success'
                        )
                        setReload(!reload)
                    })
            }
        }
        )
    }


    React.useEffect(() => {
        dispatch(setLicenseThunk())
    }, [dispatch, reload])

    return (
        <>
            <CreateLicense
                show={show}
                onClose={() => setShow(false)}
                reCharge={() => setReload(!reload)}
            />
            <ViewProduct
                products={licenses}
                handleDelete={handleDelete}
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