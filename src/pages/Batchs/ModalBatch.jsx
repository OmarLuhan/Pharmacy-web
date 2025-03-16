import { useState, useEffect,useRef } from "react";
import {
  deleteBatch,
  getBatchsByProduct,
  createBatch,
  updateBatch,
} from "../../services/batch";
import usePagination from "../../hooks/usePagination";
import Table from "../../components/Table";
import { Button, Label, Modal, TextInput} from "flowbite-react";
import { toast } from "sonner";
import useForm from "../../hooks/useForm";
import useModal from "../../hooks/useModal";
import ModalDelete from "../../components/ModalDelete";
import ModalBatchForm from "./components/ModalBatchForm";
import { BeakerIcon } from '@heroicons/react/24/solid'

const columnProperties = [
  { name: "#Lote", property: "numeroLote" },
  { name: "Stock", property: "stockLote" },
  { name: "Fecha Producción", property: "fechaProduccion" },
  { name: "Fecha Vencimiento", property: "fechaVencimiento" },
  { name: "Activo", property: "activo", type: "boolean" },
];

const ModalBatch = ({ show, onCloseModal, product }) => {
  const {
    currentPage,
    totalPages,
    onPageChange,
    setTotalPages,
    resetPagination,
  } = usePagination();

  const [showModal, openModal, closeModal] = useModal({
    create: false,
    delete: false,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [batchs, setBatchs] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  //
  const [stockTotal, setStockTotal] = useState(0)
  const [batchStock, setBatchStock] = useState(0)
  //
  const formRefs = useRef(Array(2).fill(null));
  const { form, handleChange, handleCheckChange, setForm, resetForm } = useForm(
    {
      numeroLote: "",
      productoId: product.id,
      fechaProduccion: new Date().toISOString(),
      fechaVencimiento: new Date().toISOString(),
    }
  );

  const formatDataBatch = (batch) => {
    const formattedBatch = { ...batch };
    let { fechaProduccion, fechaVencimiento } = formattedBatch;
    if (fechaProduccion instanceof Date) {
      fechaProduccion = fechaProduccion?.toISOString();
    }
    fechaProduccion = fechaProduccion?.split("T")[0];
    if (fechaVencimiento instanceof Date) {
      fechaVencimiento = fechaVencimiento?.toISOString();
    }
    fechaVencimiento = fechaVencimiento?.split("T")[0];
    return {
      ...formattedBatch,
      fechaProduccion,
      fechaVencimiento,
      productoId: product.id,
    };
  };

  const fetchBatchs = async (pageNumber = 1, pageSize = 10) => {
    try {
      setIsLoading(true);
      const { status, data, totalPages: tp } = await getBatchsByProduct(product.id, pageNumber, pageSize );
      switch (status) {
        case 200:
          setBatchs(data);
          if (totalPages != tp) {
            resetPagination();
            setTotalPages(tp);
          }; break;
        default: toast.warning(`error no controlado code : ${status}`);
      }
    } catch (e) {
      toast.error(`${e}`)
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (form.numeroLote.length < 4 || form.numeroLote.length > 20) {
      toast.warning('El lote debe tener entre 4 y 20 caracteres.');
      formRefs.current[0].focus();
      return;
    }
    try {
      setIsLoading(true);
      const { status, errorMessage } = await createBatch(formatDataBatch(form))
      switch (status) {
        case 201:
          toast.success("Lote creado correctamente.");
          await fetchBatchs(currentPage);
          handleCloseModal();
          break;
        case 409:
        case 400: toast.warning(errorMessage[0]); break;
        default: toast.warning(`Error no controlado code: ${status}`)
      }
    } catch (e) {
      toast.error(`${e}`)
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalEdit = (batch) => {
    setIsEdit(true);
    setForm(batch);
    setBatchStock(batch.stockLote)
    openModal("create");
  };
  const calculateStock = (formStock) => {
    let newStock = stockTotal - batchStock;
    newStock += Number(formStock);
    setStockTotal(newStock);
  }
  const handleEdit = async () => {
    if (form.stockLote<0) {
      toast.warning('El stock debe ser un numero positivo');
      formRefs.current[1].focus();
      return;
    }
    try {
      setIsLoading(true);
      const { status, errorMessage } = await updateBatch(formatDataBatch(form))
      switch (status) {
        case 204:
          toast.success("Lote actualizado correctamente.");
          await fetchBatchs(currentPage);
          calculateStock(form.stockLote)
          handleCloseModal();
          break;
        case 404:
        case 400: toast.warning(errorMessage[0]); break;
        default: toast.warning(`Error no controlado code: ${status}`)
      }
    } catch (e) {
      toast.error(`${e}`)
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalDelete = (batch) => {
    setForm(batch);
    openModal("delete");
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { status, errorMessage } = await deleteBatch(form.id)
      switch (status) {
        case 204:
          toast.success("Lote eliminado correctamente");
          fetchBatchs(currentPage); break;
        case 404:
        case 409:
        case 400: toast.warning(errorMessage[0]); break;
        default: toast.warning(`error no controlado code: ${status}`)
      }
    } catch (e) {
      toast.error(`${e}`)
    } finally {
      setIsLoading(false);
      handleCloseModalDelete()
    }
  };

  const handleCloseModal = () => {
    resetForm();
    closeModal("create");
  };

  const handleCloseModalDelete = () => {
    resetForm();
    closeModal("delete");
  };

  useEffect(() => {
    if (product?.id && show) {
      fetchBatchs(currentPage);
    }
    if (product?.stockTotal && show)
      setStockTotal(product.stockTotal)
    return () => { };
  }, [product.id, currentPage]);

  return (
    <>
      <Modal size="4xl" show={show} onClose={onCloseModal} popup>
        <Modal.Header className="p-4">Lotes - {product.nombre}</Modal.Header>
        <Modal.Body>
          <div className="flex flex-row gap-3 mb-3">
            <div>
              <div className="mb-1 block">
                <Label value="Producto" />
              </div>
              <TextInput
                className="text-black"
                value={product.nombre}
                disabled
              />
            </div>
            <div>
              <div className="mb-1 block">
                <Label value="Presentación" />
              </div>
              <TextInput value={product.presentacion} disabled />
            </div>
            <div>
              <div className="mb-1 block">
                <Label value="Precio" />
              </div>
              <TextInput value={product.precio} disabled />
            </div>
            <div>
              <div className="mb-1 block">
                <Label value="Stock total" />
              </div>
              <TextInput value={stockTotal} disabled />
            </div>
          </div>

          <div className="flex w-full items-center justify-end ml-auto space-x-2 sm:space-x-3 mb-3">
            <Button
              onClick={() => {
                setIsEdit(false);
                openModal("create");
              }}
            >
              <BeakerIcon className="mr-2 h-5 w-5" />

              Nuevo lote
            </Button>
          </div>
          <Table
                data={batchs}
                columnProperties={columnProperties}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                fnEdit={handleModalEdit}
                fnDelete={handleModalDelete}
                isLoading={isLoading}
              />
        </Modal.Body>
      </Modal>

      <ModalBatchForm
        form={form}
        onChange={handleChange}
        onCheckChange={handleCheckChange}
        show={showModal.create}
        onCloseModal={handleCloseModal}
        isEdit={isEdit}
        fnCreate={handleCreate}
        isLoading={isLoading}
        fnEdit={handleEdit}
        formRefs={formRefs}
      />

      <ModalDelete
        show={showModal.delete}
        message={`¿Desea eliminar el lote ${form.numeroLote}?`}
        fnDelete={handleDelete}
        fnCancel={handleCloseModalDelete}
        isLoading={isLoading}
      />
    </>
  );
};

export default ModalBatch;
