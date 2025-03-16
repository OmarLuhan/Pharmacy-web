import { useEffect, useState, useCallback } from "react";
import {
  getSaleHistory,
  getSale,
  cancelSale,
  searchSaleHistory,
} from "../../services/sale";
import { toast, Toaster } from "sonner";
import usePagination from "../../hooks/usePagination";
import useForm from "../../hooks/useForm";
import { formatDate } from "../../utils/utils";
import useModal from "../../hooks/useModal";
import SaleDetailsModal from "./components/SaleDetailsModal";
import ModalDelete from "../../components/ModalDelete";
import Table from "../../components/Table";
import Datepicker from "../../components/Datepicker";
import { Label, Select, TextInput } from "flowbite-react";
import debounce from "lodash/debounce";

import MinusCircleIcon from "../../assets/icons/MinusCircleIcon";
import VisionIcon from "../../assets/icons/VisionIcon";

const columnProperties = [
  { name: "Fecha registro", property: "fechaRegistro", type: "date" },
  { name: "Correlativo", property: "correlativo" },
  { name: "DNI Cliente", property: "clienteDni" },
  { name: "Nombre", property: "clienteNombre" },
  { name: "Total", property: "total" },
  { name: "Estado", property: "estado", type: "boolean" },
];

const getLast7Days = () => {
  const today = new Date();
  today.setDate(today.getDate() - 7);
  return today;
};

const SaleHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [ventaDetails, setVentaDetails] = useState(null);
  const [showSaleDetailsModal, setShowSaleDetailsModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const {
    currentPage,
    totalPages,
    onPageChange,
    setTotalPages,
    resetPagination,
  } = usePagination();
  const { form, handleChange, setForm } = useForm({
    searchBy: "fecha",
    value: "",
    fromDate: getLast7Days(),
    toDate: new Date(),
  });
  const [showModal, openModal, closeModal] = useModal({
    create: false,
    delete: false,
  });

  const fetchSaleHistory = async (pageNumber = 1, pageSize = 10) => {
    try {
      const params = {
        pageNumber,
        pageSize,
      };
      if (form.searchBy === "fecha" && form.fromDate && form.toDate) {
        params.StartDate = formatDate(form.fromDate, "YYYY-MM-DD");
        params.EndDate = formatDate(form.toDate, "YYYY-MM-DD");
      }
      const { status, data, totalPages: tp } = await getSaleHistory(params);
      switch (status) {
        case 200:
          setHistory(data);
          if (totalPages != tp) {
            resetPagination();
            setTotalPages(tp);
          }
          break;
        default:
          toast.warning(`error no controlado code : ${status}`);
      }
    } catch (e) {
      toast.error(`${e}`);
    }
  };
  const handleModalDelete = (history) => {
    setIsDeleteModalOpen(true);
    setForm((prevForm) => ({
      ...prevForm,
      ...history,
    }));
    openModal("delete");
  };
  const handleCloseModalDelete = () => {
    closeModal("delete");
    setIsDeleteModalOpen(false);
    setForm((prevForm) => ({ ...prevForm }));
  };
  const handleDelete = async () => {
    try {
      const { status, errorMessage } = await cancelSale(form.id);
      switch (status) {
        case 204:
          toast.success("venta cancelada correctamente");
          fetchSaleHistory(currentPage);
          break;
        case 404:
        case 409:
        case 400:
          toast.warning(errorMessage[0]);
          break;
        default:
          toast.warning(`error no controlado code: ${status}`);
      }
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      handleCloseModalDelete();
    }
  };
  const debouncedSearch = useCallback(
    debounce(async (searchValue) => {
      if (searchValue.trim() === "") {
        await fetchSaleHistory(currentPage);
        return;
      }
      if (searchValue.length > 2) {
        try {
          const { status, data, errorMessage } = await searchSaleHistory(
            searchValue
          );
          if (status === 200) {
            setHistory(data);
            resetPagination();
          } else {
            toast.warning(`Error no controlado: ${errorMessage[0]}`);
          }
        } catch (error) {
          toast.error(`${error}`);
        }
      }
    }, 500),
    []
  );
  const handleInputChange = (e) => {
    e.preventDefault();
    const value = e.currentTarget.value;
    setValueSearch(value);
    debouncedSearch(value);
  };

  const handleViewDetails = async (product) => {
    try {
      const { correlativo } = product;
      const { status, data } = await getSale(correlativo);
      switch (status) {
        case 200:
          setVentaDetails(data);
          setShowSaleDetailsModal(true);
          break;
        default:
          toast.warning(`error no controlado code : ${status}`);
      }
    } catch (e) {
      toast.error(`${e}`);
    }
  };
  useEffect(() => {
    if (isDeleteModalOpen) {
      return;
    }
    if (form.fromDate > form.toDate) {
      setForm((prevForm) => ({
        ...prevForm,
        fromDate: form.toDate,
      }));
      return;
    }
    fetchSaleHistory(currentPage);
  }, [form.fromDate, form.toDate, currentPage]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="m-5 p-5 shadow-2xl rounded-lg">
        <div className="flex gap-4">
          <div>
            <Label htmlFor="searchBy" value="Buscar por" />
            <Select
              id="searchBy"
              name="searchBy"
              value={form.searchBy}
              onChange={handleChange}
            >
              <option value="valor">Valor</option>
              <option value="fecha">Fecha</option>
            </Select>
          </div>
          {form.searchBy === "valor" ? (
            <div className="relative lg:w-64 xl:w-96">
              <Label htmlFor="searchSale" value="Valor" />
              <TextInput
                id="searchSale"
                type="text"
                name="valueSearch"
                placeholder="Buscar ventas"
                value={valueSearch}
                onChange={handleInputChange}
                onInput={handleInputChange}
              />
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="fechaProduccion" value="Desde" />
                <Datepicker
                  id="fromDate"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  labelTodayButton="Hoy"
                  labelClearButton="Limpiar"
                  required
                />
              </div>
              <div>
                <Label htmlFor="toDate" value="Hasta" />
                <Datepicker
                  id="toDate"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  labelTodayButton="Hoy"
                  labelClearButton="Limpiar"
                  required
                />
              </div>
            </>
          )}
        </div>
        <Table
          columnProperties={columnProperties}
          data={history}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          fnActions={[
            {
              name: <VisionIcon />,
              fn: handleViewDetails,
            },
            {
              name: <MinusCircleIcon />,
              fn: handleModalDelete,
            },
          ]}
        />
        <SaleDetailsModal
          ventaDetails={ventaDetails}
          showModal={showSaleDetailsModal}
          closeModal={() => setShowSaleDetailsModal(false)}
        />
        <ModalDelete
          show={showModal.delete}
          message={`¿Desea cancelar la venta ${form.correlativo}?`}
          fnDelete={handleDelete}
          fnCancel={handleCloseModalDelete}
        />
      </div>
    </>
  );
};

export default SaleHistoryPage;
