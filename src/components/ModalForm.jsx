import { Button, Label, Modal, TextInput ,Spinner} from "flowbite-react";

const ModalForm = ({
  form,
  onChange,
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
      <Modal.Header className="p-4">{isEdit ? 'Editar categoría' : 'Añadir nueva categoria'}</Modal.Header>
      <Modal.Body>
        <div className="space-y-2">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="descripcion" value="Descripción" />
            </div>
            <TextInput
              id="descripcion"
              name="descripcion"
              placeholder="Ejem: Medicamentos"
              value={form.descripcion}
              onChange={onChange}
              ref={formRefs} 
            />
          </div>
          <div className="w-full flex gap-4 justify-end pt-4">
            <Button onClick={isEdit ? fnEdit : fnCreate} disabled={isLoading}>
              {isLoading ? (<Spinner/>):(isEdit ? "Editar" : "Crear")}
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

export default ModalForm;
