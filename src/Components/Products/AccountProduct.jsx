import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAccountsThunk, deleteAccountThunk } from '../../features/account/accountSlice';
import ViewProduct from '../ViewProduct';
import Swal from 'sweetalert2';
import CreateAccount from './CreateAccount';
import EditAccount from './EditAccount';
import UploadExcel from '../UploadExcel';

const AccountProduct = () => {

    const [categoryPerfiles, setCategoryPerfiles] = useState('netflix');
    const [reload, setReload] = useState(false)
    const [show, setShow] = useState(false);

    const optionsCategory = [
        { name: 'Netflix', value: 'netflix' },
        { name: 'Max', value: 'hbo_max' },
        { name: 'amazon Prime Video', value: 'amazon_prime' },
        { name: 'Spotify', value: 'spotify' },
        { name: 'Paramount+', value: 'paramount_plus' },
        { name: 'Vix+', value: 'vix' },
        { name: 'Plex', value: 'plex' },
        { name: 'Crunchyroll', value: 'crunchyroll' },
        { name: 'El profeNet', value: 'profenet' },
        { name: 'Tidal', value: 'tidal' },
        { name: 'youtube premium', value: 'youtube' },
        { name: 'Deezer', value: 'deezer' },
        { name: 'Apple Music', value: 'apple_music' },
        { name: 'Canva', value: 'canva' },
        { name: 'Universal+', value: 'universal' },
        { name: 'Apple TV', value: 'apple_tv' },
        { name: 'Pornhub', value: 'pornhub' },
        { name: 'Duolingo', value: 'duolingo' },
        { name: 'Rakuten Viki', value: 'rakuten' },
        { name: 'Calm', value: 'calm' },
        { name: 'Mubi', value: 'mubi' },
        { name: 'Napster', value: 'napster' },
        { name: 'TVMia', value: 'tvmia' },
        { name: 'Microsoft 365', value: 'microsoft365' }
    ]


    const dispatch = useDispatch()
    const accounts = useSelector(state => state.accounts.accounts)


    // Estado para los datos de la cuenta
    const [dataAccount, setDataAccount] = useState({})

    // Estado para el modal editar
    const [openEdit, setOpenEdit] = useState(false);

      // Estado para el modal crear desde excel
      const [openExcel, setOpenExcel] = useState(false);

    const handleEdit = (data) => {
        setDataAccount(data)
        setOpenEdit(true)
    }


    const handleCategory = (e) => {
        setCategoryPerfiles(e.target.value)
        console.log(e.target.value)
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
                dispatch(deleteAccountThunk(id))
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

    useEffect(() => {
        dispatch(setAccountsThunk(categoryPerfiles))
    }, [dispatch, categoryPerfiles, reload])

    return (
        <>
           <UploadExcel
            show={openExcel}
            onClose={() => setOpenExcel(false)}
            reCharge={() => setReload(!reload)}
            url='account/uploadexcelaccount'
        />

            <EditAccount
                data={dataAccount}
                show={openEdit}
                onClose={() => setOpenEdit(false)}
                reCharge={() => setReload(!reload)}
            />
            <CreateAccount
                show={show}
                onClose={() => setShow(false)}
                reCharge={() => setReload(!reload)}
            />
            <ViewProduct
                category={categoryPerfiles}
                optionsCategory={optionsCategory}
                products={accounts}
                handleCategory={handleCategory}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleExcel={() => setOpenExcel(true)}
                setShow={setShow}
                isEdit={true}
                seeEmail={true}
            />
        </>
    );
};

export default AccountProduct;