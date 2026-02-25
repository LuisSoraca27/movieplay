import { Drawer, DrawerContent, DrawerHeader, DrawerBody, Switch } from "@heroui/react";
import PropTypes from "prop-types";
import dksoluciones from "../../api/config";
import getConfig from "../../utils/config";
import { addToast } from "@heroui/toast";
import { useEffect, useState } from "react";

let defaultPermissions = [
  { name: 'create_user', name_es: 'Crear Usuario', description: 'Permite crear nuevos usuarios', checked: false },
  { name: 'delete_user', name_es: 'Eliminar Usuario', description: 'Permite eliminar usuarios', checked: false },
  { name: 'edit_user', name_es: 'Editar Usuario', description: 'Permite editar usuarios', checked: false },
  { name: 'view_users', name_es: 'Ver Usuarios', description: 'Permite ver la lista de usuarios', checked: false },
  { name: 'create_product', name_es: 'Crear Producto', description: 'Permite crear nuevos productos', checked: false },
  { name: 'delete_product', name_es: 'Eliminar Producto', description: 'Permite eliminar productos', checked: false },
  { name: 'edit_product', name_es: 'Editar Producto', description: 'Permite editar productos', checked: false },
  { name: 'deliver_profile', name_es: 'Entregar Perfil', description: 'Entregar perfiles', checked: false },
  { name: 'deliver_account', name_es: 'Entregar Cuenta', description: 'Entregar cuentas', checked: false },
  { name: 'deliver_combo', name_es: 'Entregar Combo', description: 'Entregar_combo', checked: false },
  { name: 'deliver_course', name_es: 'Entregar Curso', description: 'Entregar cursos', checked: false },
  { name: 'deliver_others', name_es: 'Entregar Otros', description: 'Entregar otros', checked: false },
  { name: 'edit_daily_sales', name_es: 'Editar Venta Diaria', description: 'Editar registro venta diaria', checked: false },
  { name: 'delete_daily_sales', name_es: 'Eliminar Venta Diaria', description: 'Eliminar registro venta diaria', checked: false },
  { name: 'recharge', name_es: 'Recargar Saldo', description: 'Permite recargar saldo a vendedores', checked: false }
];

export default function PermissionUser({ visible, onClose, permissions, id, onPermissionChange }) {
  const [localPermissions, setLocalPermissions] = useState(defaultPermissions || []);

  async function AddPermission(permission, valuePermission) {
    try {
      await dksoluciones.post(`user/assign-permission/${id}`, {
        permissionName: permission
      }, getConfig());
      addToast({ title: "Éxito", description: "Permiso asignado correctamente", color: "success" });
      if (onPermissionChange) {
        onPermissionChange();
      }
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.message || 'Error al asignar permiso';
      addToast({ title: "Error", description: errorMsg, color: "danger" });
      setLocalPermissions(localPermissions.map(p => p.name === permission ? { ...p, checked: valuePermission } : p));
    }
  }

  async function RemovePermission(permission, valuePermission) {
    try {
      await dksoluciones.post(`user/revoke-permission/${id}`, {
        permissionName: permission
      }, getConfig());
      addToast({ title: "Éxito", description: "Permiso eliminado correctamente", color: "success" });
      if (onPermissionChange) {
        onPermissionChange();
      }
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.message || 'Error al eliminar permiso';
      addToast({ title: "Error", description: errorMsg, color: "danger" });
      setLocalPermissions(localPermissions.map(p => p.name === permission ? { ...p, checked: valuePermission } : p));
    }
  }

  const handleChange = (permissionName) => {
    const permission = localPermissions.find(p => p.name === permissionName);
    const valuePermission = permission.checked;
    setLocalPermissions(localPermissions.map(p => p.name === permissionName ? { ...p, checked: !valuePermission } : p));
    if (!valuePermission) {
      AddPermission(permissionName, valuePermission);
    } else {
      RemovePermission(permissionName, valuePermission);
    }
  };

  useEffect(() => {
    const updatedPermissions = localPermissions.map(localPerm => {
      const hasPermission = permissions.some(perm => perm.name === localPerm.name);
      return { ...localPerm, checked: hasPermission };
    });
    setLocalPermissions(updatedPermissions);
  }, [permissions]);

  return (
    <>
      <Drawer
        isOpen={visible}
        onClose={onClose}
        placement="right"
        size="md"
      >
        <DrawerContent>
          <DrawerHeader>
            <h1 className="text-xl font-bold">Permisos</h1>
          </DrawerHeader>
          <DrawerBody>
            <div className="flex flex-col gap-3">
              {localPermissions.map((permission, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg bg-gray-100"
                >
                  <Switch
                    isSelected={permission.checked}
                    onValueChange={() => handleChange(permission.name)}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold capitalize">{permission.name_es}</span>
                    <span className="text-sm text-gray-600">{permission.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

PermissionUser.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  permissions: PropTypes.array.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onPermissionChange: PropTypes.func,
};
