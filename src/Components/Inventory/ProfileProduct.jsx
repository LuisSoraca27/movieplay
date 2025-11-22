import { useEffect, useState } from 'react';
import ViewProduct from '../ViewProduct';
import { setProfilesThunk, deleteProfileThunk } from '../../features/user/profileSlice';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import CreateProfile from './CreateProfile';
import EditProfile from './EditProfile';
import UploadExcel from '../UploadExcel';

const ProfileProduct = () => {

    const optionsCategory = [
        { name: 'Netflix', value: 'netflix' },
        { name: 'Max Premium', value: 'max_premium' },
        { name: 'Max Estandar', value: 'max_estandar' },
        { name: 'amazon Prime Video', value: 'amazon_prime' },
        { name: 'Paramount+', value: 'paramount_plus' },
        { name: 'Vix+', value: 'vix' },
        { name: 'Plex', value: 'plex' },
        { name: 'Crunchyroll', value: 'crunchyroll' },
        { name: 'Black Code', value: 'profenet' },
        { name: 'IPTV', value: 'iptv' },
        { name: 'Rakuten Viki', value: 'rakuten' },
        { name: 'Disney+ Basico', value: 'Dbasico' },
        { name: 'Disney+ Estándar', value: 'Destandar' },
        { name: 'Disney+ Premium', value: 'Dpremium' },
        { name: 'Flujo TV', value: 'magistv' },
        { name: 'Mubi', value: 'mubi' },
        { name: 'universal+', value: 'universal' },
        { name: 'ClaroVideo', value: 'clarovideo' },
        { name: 'DirectTv GO', value: 'directvgo' },
        { name: 'Apple TV', value: 'apple_tv' },
        { name: 'Netflix Extra', value: 'netflix_extra' },
        { name: 'Microsoft 365', value: 'microsoft365' },
        { name: 'Wplay', value: 'wplay' },
        { name: 'ChatGPT', value: 'chatgpt' },
        { name: 'CapCut', value: 'capcut' },
        { name: 'Amazon Music', value: 'amazonmusic' },
    ]


    const [categoryPerfiles, setCategoryPerfiles] = useState('netflix');
    const [reload, setReload] = useState(false)
    const [show, setShow] = useState(false);

    // Estado para los datos del perfil
    const [dataProfile, setDataProfile] = useState({})

    // Estado para el modal editar
    const [openEdit, setOpenEdit] = useState(false);

    // Estado para el modal crear desde excel
    const [openExcel, setOpenExcel] = useState(false);

    const handleEdit = (data) => {
        setDataProfile(data)
        setOpenEdit(true)
    }

    const handleCategory = (e) => {
        setCategoryPerfiles(e.target.value)
    }

    const handleDelete = (id) => {
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
                dispatch(deleteProfileThunk(id))
                    .finally(() => {
                        setReload(!reload)
                    }
                    )

            }
        }
        )
    }


    const dispatch = useDispatch()
    const profiles = useSelector(state => state.profiles.profiles)


    useEffect(() => {
        dispatch(setProfilesThunk(categoryPerfiles))
    }, [dispatch, categoryPerfiles, reload])


    return (
        <>
            <UploadExcel
                show={openExcel}
                onClose={() => setOpenExcel(false)}
                reCharge={() => setReload(!reload)}
                url='profile/uploadexcelprofile'
            />
            <EditProfile
                show={openEdit}
                onClose={() => setOpenEdit(false)}
                reCharge={() => setReload(!reload)}
                data={dataProfile}
            />

            <CreateProfile
                show={show}
                onClose={() => setShow(false)}
                reCharge={() => setReload(!reload)}
            />
            <ViewProduct
                category={categoryPerfiles}
                optionsCategory={optionsCategory}
                products={profiles}
                handleCategory={handleCategory}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                setShow={setShow}
                handleExcel={() => setOpenExcel(true)}
                isEdit={true}
                seeEmail={true}
            />
        </>
    );
};

export default ProfileProduct;