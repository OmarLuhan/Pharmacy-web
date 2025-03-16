import React from "react";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  TextInput,
  Spinner
} from "flowbite-react";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../../services/category";
import Datepicker from "../../../components/Datepicker";

const ModalProductForm = ({
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
  const [categories, setCategories] = useState([]);

  const getCategories= async()=>{
    try{
      const {status,data,errorMessage} =await getAllCategories();
      switch(status){
        case 200: setCategories(data);break;
        default: warning.error(`Error no controlado: ${errorMessage}`);
      }
    }catch(error){
      toast.error(`${error}`);
    }
  }
  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Modal show={show} size="4xl" onClose={onCloseModal} popup>
      <Modal.Header className="p-4">
        {isEdit ? "Editar producto" : "Añadir nuevo producto"}
      </Modal.Header>
      <Modal.Body className="flex-1 overflow-visible p-6 pt-0 ">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigoEan13" value="Código" />
              <TextInput
                id="codigoEan13"
                name="codigoEan13"
                placeholder="Código de barras"
                value={form.codigoEan13}
                onChange={onChange}
                disabled={isEdit}
                ref={(el) => (formRefs.current[0] = el)}
              />
            </div>
            <div>
              <Label htmlFor="nombre" value="Nombre" />
              <TextInput
                id="nombre"
                name="nombre"
                placeholder="Ejem: Paracetamol 500mg"
                value={form.nombre}
                onChange={onChange}
                ref={(el) => (formRefs.current[1] = el)}
              />
            </div>
            <div>
              <Label htmlFor="categoria" value="Categoría" />
              <Select
                id="categoria"
                name="categoriaId"
                value={form.categoriaId}
                onChange={onChange}
              >
                {categories.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.descripcion}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="presentacion" value="Presentación" />
              <TextInput
                id="presentacion"
                name="presentacion"
                placeholder="Ejem: Caja 20 tabletas"
                value={form.presentacion}
                onChange={onChange}
                ref={(el) => (formRefs.current[2] = el)}
              />
            </div>
            <div>
              <Label htmlFor="precio" value="Precio" />
              <TextInput
                type="number"
                id="precio"
                name="precio"
                value={form.precio}
                onChange={onChange}
                min={0}
                required
                step="0.01"
                ref={(el) => (formRefs.current[3] = el)}
              />
            </div>
            {!isEdit && (
              <>
                <div>
                  <Label htmlFor="numeroLote" value="# Lote" />
                  <TextInput
                    id="numeroLote"
                    name="numeroLote"
                    value={form.numeroLote}
                    onChange={onChange}
                    required
                    ref={(el) => (formRefs.current[4] = el)}
                  />
                </div>
                <div>
                  <Label htmlFor="fechaProduccion" value="Fecha Producción" />
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
                  <Label htmlFor="fechaVencimiento" value="Fecha Vencimiento" />
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
              </>
            )}
            <div className="col-span-2 flex items-center">
              <Checkbox
                className="cursor-pointer mr-3"
                id="especial"
                name="especial"
                checked={form.especial}
                onChange={onCheckChange}
              />
              <Label htmlFor="especial" value="Especial" />
            </div>
            <div className="w-full flex gap-4 justify-end pt-4 col-span-2">
              <Button type="button" onClick={isEdit ? fnEdit : fnCreate} disabled={isLoading}>
                {isLoading ? (<Spinner/>) : isEdit ? "Editar" : "Crear"}
              </Button>
              <Button color="gray" onClick={onCloseModal}>
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalProductForm;
