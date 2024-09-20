import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import '../style/users.css'
import { setUsersAdminThunk, setUsersSellerThunk, deleteUserThunk } from '../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import ModalCreateUser from '../Components/ModalCreateUser';
import ModalRecharge from '../Components/ModalRecharge'
import { setIsLoading } from '../features/isLoading/isLoadingSlice'
import IsLoading from '../Components/IsLoading'
import Swal from 'sweetalert2';
import ModalEditUser from '../Components/ModalEditUser';
import { removeError } from '../features/error/errorSlice';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { TieredMenu } from 'primereact/tieredmenu';
import { useRef } from 'react';
        

const User = () => {

    const menu = useRef(null);

    const items = [
        {
            label: 'Editar',
            icon: 'pi pi-user-edit',
            command: () => handleEdit(selectedUser)
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-delete-left',
            command: () => handleDelete(selectedUser.id)
        }
    ];

    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false);
    const onClose = () => setOpen(false);
    const [openRecharge, setOpenRecharge] = useState(false);
    const onCloseRecharge = () => setOpenRecharge(false);
    const [openEdit, setOpenEdit] = useState(false);
    const onCloseEdit = () => setOpenEdit(false);
    const [userEdit, setUserEdit] = useState(null);
    const [reload, setReload] = useState(false);
    const [idUser, setIdUser] = useState('');
    const [usersFilter, setUsersFilter] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        balance: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [statuses] = useState(['active', 'disabled', 'new']);


    const dispatch = useDispatch();
    const { usersAdmin } = useSelector(state => state.user);
    const { usersSeller } = useSelector(state => state.user);
    const isLoadingState = useSelector((state) => state.isLoading);
    const { error } = useSelector((state) => state.error);


        const getSeverity = (status) => {
            switch (status) {
                case 'disabled':
                    return 'danger';
    
                case 'active':
                    return 'success';
    
                case 'new':
                    return 'info';
            }
        };
        
    const handleRecharge = (id) => {
        setIdUser(id);
        setOpenRecharge(true);
    }

    const handleEdit = (user) => {
        setUserEdit(user);
        setOpenEdit(true);
    }
    
    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const statusRowFilterTemplate = (options) => {
        return (
            <Dropdown
             value={options.value} 
             options={statuses}
             onChange={(e) => options.filterApplyCallback(e.value)}
             itemTemplate={statusItemTemplate} 
             className="p-column-filter"
             showClear 
             placeholder="Todos"
            />
        );
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Busqueda" 
                     className='small-input' size={"small"}
                    />
                </span>
            </div>
        );
    };

    React.useEffect(() => {
        handleErrors();
        dispatch(setIsLoading(true));
        dispatch(setUsersAdminThunk());
        dispatch(setUsersSellerThunk())
            .finally(() => {
                dispatch(setIsLoading(false));
            })
    }, [dispatch, reload])

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estas seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '!Si, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteUserThunk(id))
                    .finally(() => {
                        Swal.fire(
                            'Eliminado!',
                            'El usuario ha sido eliminado.',
                            'success'
                        )
                    }
                    )
                setReload(!reload)
            }
        });
    }

    const handleErrors = () => {
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
                cancelButtonText: 'Ok'
            })
            dispatch(removeError())
        }
    }


    return (
        <>
            {isLoadingState ? <IsLoading /> :
                <>
                    <ModalCreateUser open={open} onClose={onClose} recharge={() => setReload(!reload)} />
                    <ModalRecharge
                        open={openRecharge}
                        onClose={onCloseRecharge}
                        recharge={() => setReload(!reload)}
                        idUser={idUser}
                    />
                    <ModalEditUser
                        open={openEdit}
                        onClose={onCloseEdit}
                        recharge={() => setReload(!reload)}
                        data={userEdit}
                    />
                    <div className='container-users'>
                        <div className="header-users">
                            <span style={{ padding: '10px', borderRadius: '5px'}}>
                                <i className="pi pi-users mr-2 title-users"></i>
                                <span className="vertical-align-middle title-users">  Usuarios</span>
                            </span>
                            <Button label="Crear usuario" icon="pi pi-plus" 
                                onClick={() => setOpen(true)}
                                severity='success'
                                rounded
                            />
                        </div>
                        <Accordion  activeIndex={0}>
                        <AccordionTab header={
                                <div>
                                      <i className="pi pi-user mr-2"></i>
                                      <span className="vertical-align-middle">  Usuarios administradores</span>
                                </div>
                            }>
                           <DataTable value={usersAdmin} size='small' >
                            <Column field="username" header="Nombre de usuario" />
                            <Column field="email" header="Correo" />
                            <Column header="Acciones" body={(rowData) => (
                                <div >
                                    <Button
                                        label="Editar"
                                        severity='primary'
                                        rounded
                                        size='small'
                                        style={{ marginLeft: '5px' }}
                                        onClick={() => handleEdit(rowData)}
                                    />
                                    <Button
                                        label="Eliminar"
                                        severity='danger'
                                        rounded
                                        size='small'
                                        style={{ marginLeft: '5px' }}
                                        onClick={() => handleDelete(rowData.id)}
                                    />
                                </div>
                            )} />
                        </DataTable>
                            </AccordionTab>
                            <br />
                            <br />
                        </Accordion>
                       <div style={{position: 'relative'}}>
                       <Badge value={usersSeller.length}
                       style={{position: 'absolute', right: '15px', top: '20px', zIndex: '1'}}
                       ></Badge>
                       <Accordion  activeIndex={0} 
                       style={{marginTop: '10px', zIndex: '0'}}
                       >
                        <AccordionTab header={
                                <div>
                                      <i className="pi pi-user mr-2"></i>
                                      <span className="vertical-align-middle">  Usuarios vendedores</span>
                                </div>
                            }>
{/*                                  */}
                            <DataTable value={usersSeller} size='small' paginator rows={50} emptyMessage="Sin resultados"
                            filters={filters} filterDisplay='row' globalFilterFields={["username", "email", "phone", "balance", "status"]}
                            header={renderHeader()} stripedRows 
                            >
                            <Column field="username" header="Nombre de usuario"/>
                            <Column field="email" header="Correo" />
                            <Column field="phone" header="Teléfono" />
                            <Column field="balance" header="Saldo"  />
                            <Column field="status" header="Estado"
                             filterField="status"
                             body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate}/>
                            <Column header="Acciones" body={(rowData) => (
                                <div>
                                    <Button
                                        label="Recargar"
                                        onClick={() => handleRecharge(rowData.id)}
                                        severity='success'
                                        rounded
                                        size='small'
                                        style={{ marginLeft: '5px' }}
                                    />
                                       <Button  
                                       onClick={(event) => {
                                        menu.current.toggle(event)
                                        setSelectedUser(rowData)
                                       }} 
                                       icon="pi pi-ellipsis-v"
                                       className="p-button-text p-button-secondary p-button-rounded"
                                       size='small'
                                       style={{ marginLeft: '9px' }}
                                       />
                                </div>
                            )} />
                        </DataTable>
                            </AccordionTab>
                        </Accordion>
                        <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
                       </div>
                    </div>
                </>
            }
        </>
    );
};

export default User;
