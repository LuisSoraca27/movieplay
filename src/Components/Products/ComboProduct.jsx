import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setComboThunk, deleteComboThunk } from '../../features/user/comboSlice';
import ViewProduct from '../ViewProduct';
import Swal from 'sweetalert2';
import CreateCombo from './CreateCombo';
import EditCombos from './EditCombos';

const ComboProduct = () => {

    const [reload, setReload] = useState(false)

    const [show, setShow] = useState(false);

    //Estado modal editar
    const [openEdit, setOpenEdit] = useState(false);

    const [dataCombo, setDataCombo] = useState({})

    const handleEdit = (data) => {
        setOpenEdit(true)
        setDataCombo(data)
        console.log(data)
    }


    const dispatch = useDispatch()
    const combos = useSelector(state => state.combos)


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
                dispatch(deleteComboThunk(id))
                    .finally(() => {
                        Swal.fire(
                            'Eliminado!',
                            'El Combo ha sido eliminado.',
                            'success'
                        )
                        setReload(!reload)
                    }
                    )
            }
        }
        )
    }


    useEffect(() => {
        dispatch(setComboThunk())
    }, [dispatch, reload])

    return (
        <>
            <CreateCombo
                show={show}
                onClose={() => setShow(false)}
                reCharge={() => setReload(!reload)}
            />

            <EditCombos
                show={openEdit}
                onClose={() => setOpenEdit(false)}
                reCharge={() => setReload(!reload)}
                data={dataCombo}
            />
            <ViewProduct
                products={combos}
                handleDelete={handleDelete}
                setShow={setShow}
                isEdit={true}
                handleEdit={handleEdit}
            />
        </>
    );
};

export default ComboProduct;