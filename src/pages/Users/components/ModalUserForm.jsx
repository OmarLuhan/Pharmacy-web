import {
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import {
  ArrowPathRoundedSquareIcon
} from '@heroicons/react/24/solid';

const ModalUserForm = ({
  form,
  onChange,
  onCheckChange,
  show,
  onCloseModal,
  fnCreate,
  fnEdit,
  isEdit,
  isLoading,
  formRefs
}) => {
  return (
    <Modal show={show} size="md" onClose={onCloseModal} popup>
      <Modal.Header className="p-4">
        {isEdit ? "Editar Usuario" : "Añadir Nuevo Usuario"}
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-2">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="Nombre" />
            </div>
            <TextInput
              id="username"
              name="nombre"
              placeholder="Juan Gomez"
              value={form.nombre}
              onChange={onChange}
              ref={(el) => (formRefs.current[0] = el)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Correo" />
            </div>
            <TextInput
              id="email"
              name="correo"
              placeholder="juan@gmail.com"
              type="email"
              value={form.correo}
              onChange={onChange}
              ref={(el) => (formRefs.current[1] = el)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="rol" value="Rol" />
            </div>
            <Select
              id="rol"
              name="rolId"
              value={form.rolId}
              onChange={onChange}
              required
            >
              <option value={2}>Usuario</option>
              <option value={1}>Administrador</option>
            </Select>
          </div>
          {isEdit && (
            <div>
              <Checkbox
                className="cursor-pointer mr-3"
                id="activo"
                name="activo"
                onChange={onCheckChange}
                checked={form.activo}
                required
              />
              <Label htmlFor="activo" value="Activo" />
            </div>
          )}
          <div className="w-full flex gap-4 justify-end pt-4">
            <Button onClick={isEdit ? fnEdit : fnCreate} disabled={isLoading}>
              {isLoading ? (<ArrowPathRoundedSquareIcon className="size-6 animate-spin" />) : isEdit ? ("Editar") : ("Crear")}
            </Button>
            <Button color="gray" onClick={onCloseModal}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalUserForm;
