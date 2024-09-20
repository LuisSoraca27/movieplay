import React from 'react';
import ViewProduct from '../ViewProduct';
import { setCourseThunk, deleteCourseThunk } from '../../features/course/courseSlice'
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import CreateCourse from './CreateCourse';
import EditCourse from './EditCourse';

const CourseProduct = () => {

    const [reload, setReload] = React.useState(false)
    const [show, setShow] = React.useState(false);

    const dispatch = useDispatch()
    const courses = useSelector(state => state.courses)

    const [dataCourse, setDataCourse] = React.useState({})
    const [openEdit, setOpenEdit] = React.useState(false)

    const handleEdit = (data) => {
        setDataCourse(data)
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
                dispatch(deleteCourseThunk(id))
                    .finally(() => {
                        Swal.fire(
                            'Eliminado!',
                            'El Curso ha sido eliminado.',
                            'success'
                        )
                        setReload(!reload)
                    })
            }
        }
        )
    }


    React.useEffect(() => {
        dispatch(setCourseThunk())
    }, [dispatch, reload])

    return (
        <>
            <CreateCourse
                show={show}
                onClose={() => setShow(false)}
                reCharge={() => setReload(!reload)}
            />
            <ViewProduct
                products={courses}
                handleDelete={handleDelete}
                isEdit={true}
                setShow={setShow}
                handleEdit={handleEdit}
            />

            <EditCourse
                show={openEdit}
                onClose={() => setOpenEdit(false)}
                dataCourse={dataCourse}
                reCharge={() => setReload(!reload)}
            />
        </>
    );
};

export default CourseProduct;