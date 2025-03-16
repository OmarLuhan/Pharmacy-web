import { Button, Label, Modal, TextInput, Spinner } from "flowbite-react";
import Datepicker from "../../../components/Datepicker";

const ModalBatchForm = ({
  form,
  onChange,
  show,
  onCloseModal,
  fnCreate,
  fnEdit,
  isEdit,
  isLoading,
  formRefs,
}) => {
  return (
    <Modal
      show={show}
      size="2xl"
      onClose={onCloseModal}
      popup
      className="h-auto"
    >
      <Modal.Header className="p-4">
        {isEdit ? "Editar lote" : "Añadir nuevo lote"}
      </Modal.Header>
      <Modal.Body className="flex-1 overflow-visible p-6 pt-0 ">
        <div className="space-y-4">
          {/* Campo Número de Lote */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="numeroLote" value="#Lote" />
            </div>
            <TextInput
              id="numeroLote"
              name="numeroLote"
              placeholder="Ejem: L015"
              value={form.numeroLote}
              onChange={onChange}
              ref={(el) => (formRefs.current[0] = el)}
              disabled={isEdit}
            />
          </div>

          {/* Campo Stock (Solo edición) */}
          {isEdit && (
            <div>
              <div className="mb-2 block">
                <Label htmlFor="stockLote" value="Stock" />
              </div>
              <TextInput
                type="number"
                id="stockLote"
                name="stockLote"
                value={form.stockLote}
                onChange={onChange}
                ref={(el) => (formRefs.current[1] = el)}
                min={0}
              />
            </div>
          )}

          {/* Fechas de Producción y Vencimiento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="fechaProduccion" value="Fecha Producción" />
              </div>
              <Datepicker
                id="fechaProduccion"
                name="fechaProduccion"
                value={form.fechaProduccion}
                onChange={onChange}
                labelTodayButton="Hoy"
                labelClearButton="Limpiar"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="fechaVencimiento" value="Fecha Vencimiento" />
              </div>
              <Datepicker
                id="fechaVencimiento"
                name="fechaVencimiento"
                value={form.fechaVencimiento}
                onChange={onChange}
                labelTodayButton="Hoy"
                labelClearButton="Limpiar"
                required
              />
            </div>
          </div>

          {/* Botones */}
          <div className="w-full flex gap-4 justify-end pt-4">
            <Button onClick={isEdit ? fnEdit : fnCreate} disabled={isLoading}>
              {isLoading ? <Spinner /> : isEdit ? "Editar" : "Crear"}
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

export default ModalBatchForm;
