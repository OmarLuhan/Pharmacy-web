import { useEffect, useState, useRef, useCallback } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  deleteProduct,
  getProductDownload,
  getProducts,
  createProduct,
  updateProduct,
  searchProductsByName,
} from "../../services/product";
import { Button, Spinner, TextInput } from "flowbite-react";
import { toast, Toaster } from "sonner";
import usePagination from "../../hooks/usePagination";
import useForm from "../../hooks/useForm";
import useModal from "../../hooks/useModal";
import Table from "../../components/Table";
import ModalDelete from "../../components/ModalDelete";
import ModalProductForm from "./components/ModalProductForm";
import ModalBatch from "../Batchs/ModalBatch";
import { formatDate } from "../../utils/utils";
import debounce from "lodash/debounce";
import {
  TrashIcon,
  PlusIcon,
  InformationCircleIcon,
  EllipsisVerticalIcon,
  CogIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";

const columnProperties = [
  { name: "id", property: "id" },
  { name: "Código", property: "codigoEan13" },
  { name: "Nombre", property: "nombre" },
  { name: "Categoría", property: "categoriaNombre" },
  { name: "Presentación", property: "presentacion" },
  { name: "Precio", property: "precio" },
  { name: "Stock", property: "stockTotal" },
];

const ProductsPage = () => {
  const {
    currentPage,
    totalPages,
    onPageChange,
    setTotalPages,
    resetPagination,
  } = usePagination();
  const [products, setProducts] = useState([]);
  const [valueSearch, setValueSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, openModal, closeModal] = useModal({
    create: false,
    delete: false,
    batch: false,
  });
  const { form, handleChange, handleCheckChange, setForm, resetForm } = useForm(
    {
      id: 0,
      codigoEan13: "",
      nombre: "",
      categoriaId: 1,
      presentacion: "",
      concentracion: "",
      precio: "",
      especial: false,
      numeroLote: "",
      fechaProduccion: new Date(),
      fechaVencimiento: new Date(),
    }
  );
  const formRefs = useRef(Array(5).fill(null));

  const handleCloseModal = () => {
    resetForm();
    closeModal("create");
  };

  const fetchProducts = async (pageNumber = 1, pageSize = 10) => {
    try {
      setIsLoading(true);
      const {
        status,
        data,
        totalPages: tp,
      } = await getProducts(pageNumber, pageSize);
      switch (status) {
        case 200:
          setProducts(data);
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
    } finally {
      setIsLoading(false);
    }
  };
  const debouncedSearch = useCallback(
    debounce(async (searchValue) => {
      if (searchValue.trim() === "") {
        await fetchProducts(currentPage);
        return;
      }

      if (searchValue.length > 2) {
        try {
          const { status, data, errorMessage } = await searchProductsByName(
            searchValue
          );
          if (status === 200) {
            setProducts(data);
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

  const handleCreate = async () => {
    const data = {
      id: form.id,
      codigoEan13: form.codigoEan13,
      nombre: form.nombre,
      categoriaId: form.categoriaId,
      presentacion: form.presentacion,
      concentracion: form.concentracion,
      precio: form.precio,
      especial: form.especial,
      lotes: [
        {
          numeroLote: form.numeroLote,
          fechaProduccion: formatDate(form.fechaProduccion, "YYYY-MM-DD"),
          fechaVencimiento: formatDate(form.fechaVencimiento, "YYYY-MM-DD"),
        },
      ],
    };
    if (data.codigoEan13.length < 4 || data.codigoEan13.length > 14) {
      toast.warning("El código debe tener entre 4 y 14 caracteres.");
      formRefs.current[0].focus();
      return;
    }
    if (data.nombre.length < 5 || data.nombre.length > 50) {
      toast.warning("El nombre debe tener entre 5 y 50 caracteres.");
      formRefs.current[1].focus();
      return;
    }
    if (!data.presentacion.trim()) {
      toast.warning("La Presentación no debe estar vacío.");
      formRefs.current[2].focus();
      return;
    }
    if (!data.precio || data.precio < 0) {
      toast.warning("El precio debe ser positivo");
      formRefs.current[3].focus();
      return;
    }
    console.log(data);
    if (!data.lotes[0].numeroLote) {
      toast.warning("El Numero Lote no debe estar vacío.");
      formRefs.current[4].focus();
      return;
    }

    try {
      setIsLoading(true);
      const { status, errorMessage } = await createProduct(data);
      switch (status) {
        case 201:
          toast.success("Producto creado correctamente.");
          fetchProducts(currentPage);
          handleCloseModal();
          break;
        case 409:
        case 400:
          toast.warning(errorMessage[0]);
          break;
        default:
          toast.warning(`Error no controlado code: ${status}`);
      }
    } catch (e) {
      toast.error(`${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalEdit = (product) => {
    setIsEdit(true);
    setForm(product);
    openModal("create");
  };

  const handleEdit = async () => {
    const data = {
      id: form.id,
      codigoEan13: form.codigoEan13,
      nombre: form.nombre,
      categoriaId: form.categoriaId,
      presentacion: form.presentacion,
      concentracion: form.concentracion,
      precio: form.precio,
      especial: form.especial,
      activo: form.activo,
    };
    if (data.codigoEan13.length < 4 || data.codigoEan13.length > 14) {
      toast.warning("El código debe tener entre 4 y 14 caracteres.");
      formRefs.current[0].focus();
      return;
    }
    if (data.nombre.length < 5 || data.nombre.length > 50) {
      toast.warning("El nombre debe tener entre 5 y 50 caracteres.");
      formRefs.current[1].focus();
      return;
    }
    if (!data.presentacion.trim()) {
      toast.warning("La Presentación no debe estar vacío.");
      formRefs.current[2].focus();
      return;
    }
    if (!data.precio || data.precio < 0) {
      toast.warning("El precio debe ser positivo");
      formRefs.current[3].focus();
      return;
    }
    try {
      setIsLoading(true);
      const { status, errorMessage } = await updateProduct(data);
      switch (status) {
        case 204:
          toast.success("El producto se ha actualizado correctamente.");
          fetchProducts(currentPage);
          handleCloseModal();
          break;
        case 404:
        case 400:
          toast.warning(errorMessage[0]);
          break;
        default:
          toast.warning(`Error no controlado code: ${status}`);
      }
    } catch (e) {
      toast.error(`${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalDelete = (Product) => {
    console.log(Product);
    openModal("delete");
  };
  const handleCloseModalDelete = () => {
    closeModal("delete");
    resetForm();
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { status, errorMessage } = await deleteProduct(form.id);
      switch (status) {
        case 204:
          toast.success("El usuario se ha eliminado correctamente");
          fetchProducts(currentPage);
          break;
        case 404:
        case 409:
        case 400:
          toast.warning(errorMessage[0]);
          break;
        default:
          toast.warning(`error no controlado code: ${status}`);
      }
    } catch (e) {
      toast.error(`${e}`);
    } finally {
      setIsLoading(false);
      handleCloseModalDelete();
    }
  };

  const handleDownloadPdf = async () => {
    setIsLoading(true);
    try {
      const download = await getProductDownload();
      if (!download.data || download.data.length === 0) {
        toast.warning("No hay datos para descargar");
        return;
      }
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(
        "Reporte de Productos",
        doc.internal.pageSize.getWidth() / 2,
        20,
        { align: "center" }
      );

      // Definir columnas
      const columns = [
        { header: "ID", dataKey: "id" },
        { header: "Código EAN13", dataKey: "codigoEan13" },
        { header: "Nombre", dataKey: "nombre" },
        { header: "Presentación", dataKey: "presentacion" },
        { header: "Categoría", dataKey: "categoriaNombre" },
        { header: "Stock", dataKey: "stockTotal" },
        { header: "Precio", dataKey: "precio" },
      ];

      // Preparar datos
      const rows = download.data.map((item) => ({
        id: item.id,
        codigoEan13: item.codigoEan13,
        nombre: item.nombre,
        presentacion: item.presentacion,
        categoriaNombre: item.categoriaNombre || "N/A",
        stockTotal: item.stockTotal,
        precio: item.precio,
      }));

      doc.autoTable({
        columns: columns,
        body: rows,
        startY: 30,
        headStyles: {
          fillColor: [0, 123, 255],
          textColor: 255,
          fontSize: 10,
          halign: "center",
        },
        bodyStyles: {
          fontSize: 9,
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        didDrawPage: function () {
          doc.setFontSize(10);
          doc.setTextColor(100);
          doc.text(
            "Reporte generado por CrisFarma",
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" }
          );
        },
        margin: { top: 30 },
      });

      doc.save(`reporte-productos-${new Date().toLocaleDateString()}.pdf`);
      toast.success("PDF descargado exitosamente");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      toast.error("Error al generar el PDF");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="m-5 p-5 shadow-2xl rounded-lg ">
        <div className="w-full mb-1">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Productos
            </h1>
          </div>
          <div className="sm:flex">
            <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0">
              <form className="lg:pr-3" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="products-search" className="sr-only">
                  Buscar
                </label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="products-search"
                    type="text"
                    maxLength={30}
                    name="product"
                    placeholder="Buscar productos"
                    value={valueSearch}
                    onChange={handleInputChange}
                    onInput={handleInputChange}
                  />
                </div>
              </form>
              <div>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                >
                  <CogIcon className="size-6" />
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                >
                  <TrashIcon className="size-6" />
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                >
                  <InformationCircleIcon className="size-6" />
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                >
                  <EllipsisVerticalIcon className="size-6" />
                </a>
              </div>
            </div>
            <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
              <Button
                onClick={() => {
                  setIsEdit(false);
                  openModal("create");
                }}
              >
                <PlusIcon className="mr-2 h-5 w-5" /> Nuevo producto
              </Button>

              <Button onClick={handleDownloadPdf} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                  </>
                ) : (
                  <>
                    <DocumentTextIcon className="mr-2 h-5 w-5" /> pdf
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        <Table
          data={products}
          columnProperties={columnProperties}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          fnEdit={handleModalEdit}
          fnDelete={handleModalDelete}
          isLoading={isLoading}
          fnActions={[
            {
              name: "Ver lote",
              fn: (product) => {
                setForm(product);
                openModal("batch");
              },
            },
          ]}
        />

        <ModalProductForm
          form={form}
          onChange={handleChange}
          onCheckChange={handleCheckChange}
          show={showModal.create}
          onCloseModal={handleCloseModal}
          isEdit={isEdit}
          fnCreate={handleCreate}
          fnEdit={handleEdit}
          isLoading={isLoading}
          formRefs={formRefs}
        />

        <ModalDelete
          show={showModal.delete}
          message={`¿Desea eliminar el producto ${form.nombre}?`}
          fnDelete={handleDelete}
          fnCancel={handleCloseModalDelete}
          isLoading={isLoading}
        />

        <ModalBatch
          show={showModal.batch}
          onCloseModal={() => {
            closeModal("batch");
          }}
          product={form}
        />
      </div>
    </>
  );
};

export default ProductsPage;
