import { Button, Label, Select, Spinner, TextInput } from "flowbite-react";
import useForm from "../../hooks/useForm";
import { useRef, useState, useCallback, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { searchRuc } from "../../services/dniquery/dni";
import debounce from "lodash/debounce";
import {
  getProductForGrn,
  getProductForGrnName,
  createProduct,
} from "../../services/product";
import {
  BeakerIcon,
  ArrowPathIcon,
  InboxArrowDownIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import useModal from "../../hooks/useModal";
import ModalBatchForm from "../Batchs/components/ModalBatchForm";
import { createBatch } from "../../services/batch";
import Table from "../../components/Table";
import usePagination from "../../hooks/usePagination";
import ModalProductForm from "../Products/components/ModalProductForm";
import { formatDate } from "../../utils/utils";
import { saveGoodsReceived } from "../../services/goodsReceived";

const columnProperties = [
  { name: "id", property: "id" },
  { name: "Código", property: "codigoEan13" },
  { name: "Nombre", property: "nombre" },
  { name: "Presentación", property: "presentacion" },
  { name: "Lote", property: "numeroLote" },
  { name: "Precio", property: "precio" },
  { name: "Stock", property: "stockTotal" },
];

const GoodsReceivedPage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [history, setHistory] = useState([]);
  const { currentPage, onPageChange } = usePagination();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRuc, setLoadingRuc] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [documnetProveedor, setDocumentProveedor] = useState("");
  const inputProductRef = useRef(null);
  const isSelecting = useRef(false);
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const formProductRefs = useRef(Array(5).fill(null));
  const formBatchRefs = useRef(Array(2).fill(null));
  const formCarRefs = useRef(Array(3).fill(null));
  const { form, handleChange, clearField, resetForm } = useForm({
    usuarioId: "",
    proveedor: "",
    codigoProducto: "",
    documento: "Factura",
    subTotal: 0,
    igv: 0,
    total: 0,
  });
  const {
    form: batchForm,
    handleChange: batchChange,
    handleCheckChange: batchCheckChange,
    resetForm: batchResetForm,
  } = useForm({
    numeroLote: "",
    productoId: 0,
    fechaProduccion: new Date().toISOString(),
    fechaVencimiento: new Date().toISOString(),
  });
  const {
    form: productoForm,
    handleChange: productoChange,
    handleCheckChange: productoCheckChange,
    resetForm: productoResetForm,
  } = useForm({
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
  });
  const {
    form: carForm,
    handleChange: handleCarFormChange,
    resetForm: resetCarForm,
    setForm: setCarForm,
  } = useForm({ nombreProducto: "", loteId: 0, cantidad: "", precio: "" });
  const [amounts, setAmounts] = useState({
    total: 0,
    igv: 0,
    subtotal: 0,
  });

  const [showModal, openModal, closeModal] = useModal({
    createProduct: false,
    createBatch: false,
  });

  const fetchProveedorData = async (ruc) => {
    setLoadingRuc(true);
    try {
      const { success, message, data } = await searchRuc({
        ruc: ruc.trim(),
      });
      if (!success) throw new Error(message);
      setNombreCompleto(data.nombre_o_razon_social);
    } catch (e) {
      toast.warning(`${e}`);
    } finally {
      setLoadingRuc(false);
    }
  };
  const debouncedSearch = useCallback(
    debounce(async (searchValue) => {
      if (searchValue.trim() === "") return;
      if (searchValue.length === 11 && /^\d+$/.test(searchValue)) {
        await fetchProveedorData(searchValue);
      }
    }, 500),
    []
  );
  const handleDocumentChange = (e) => {
    e.preventDefault();
    const value = e.currentTarget.value;
    if (value.length < 11) setNombreCompleto("");
    setDocumentProveedor(value);
    debouncedSearch(value);
  };
  const handleSearchProductByName = async (event) => {
    const value = event.target.value.trim();
    if (!value) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const { status, data } = await getProductForGrnName(value);
      if (!status == 200) {
        setSearchResults([]);
        toast.warning("No se encontraron productos");
      }
      setSearchResults(data);
      setSelectedProduct(data);
      setShowSuggestions(true);
    } catch (error) {
      setSearchResults([]);
      toast.error("no se pudo obtener los productos");
    }
  };
  const handleSelectProduct = (selectedProduct) => {
    isSelecting.current = false;
    const productExists = products.some(
      (p) => p.codigoEan13 === selectedProduct.codigoEan13
    );
    if (productExists) {
      toast.warning("El producto ya fue añadido.");
      return;
    } else {
      const product = {
        ...selectedProduct,
        cantidad: 1,
        total: selectedProduct.precio || 0,
      };
      updateProducts([...products, product]);
      toast.success("Producto añadido");
    }
    setSelectedProduct(selectedProduct);
    setSearchValue("");
    setSearchResults([]);
    setShowSuggestions(false);
    setProducts([]);
  };
  const handleChangeProduct = async (evt) => {
    evt.preventDefault();
    const code = form.codigoProducto.trim();
    if (!code) return;
    const productExists = products.some((p) => p.codigoEan13 === code);
    if (productExists) {
      toast.warning("El producto ya fue añadido.");
      return;
    }
    try {
      const { status, data } = await getProductForGrn(code);
      if (status !== 200) {
        toast.warning("producto no encontrado");
        return;
      }
      const { precio } = data;
      const product = {
        ...data,
        cantidad: 1,
        total: precio || 0,
      };
      setSelectedProduct(product);
      updateProducts([...products, product]);
      clearField("codigoProducto");
      toast.success("Producto añadido.");
    } catch (e) {
      clearField("codigoProducto");
      toast.error(`${e}`);
    }
  };
  const handlePlusProduct = (entry) => {
    setHistory((prevHistory) => {
      const newHistory = prevHistory.map((item) => {
        if (item.id !== entry.id) return item;
        const newQuantity = item.stockTotal + 1;
        return {
          ...item,
          stockTotal: newQuantity,
        };
      });
      const subtotal = newHistory.reduce(
        (sum, entry) => sum + entry.precio * entry.stockTotal,
        0
      );
      const igv = parseFloat((subtotal * 0.18).toFixed(2));
      const total = parseFloat((subtotal + igv).toFixed(2));
      setAmounts({
        total,
        subtotal,
        igv,
      });
      return newHistory;
    });
  };
  const handleMinusEntry = (entry) => {
    setHistory((prevHistory) => {
      let newHistory = prevHistory
        .map((item) => {
          if (item.id !== entry.id) return item;
          const newQuantity = item.stockTotal - 1;
          if (newQuantity <= 0) {
            toast.warning("producto quitado.");
            return null;
          }
          return {
            ...item,
            stockTotal: newQuantity,
          };
        })
        .filter(Boolean);
      const subtotal = newHistory.reduce(
        (sum, entry) => sum + entry.precio * entry.stockTotal,
        0
      );
      const igv = parseFloat((subtotal * 0.18).toFixed(2));
      const total = parseFloat((subtotal + igv).toFixed(2));

      setAmounts({
        total,
        subtotal,
        igv,
      });

      return newHistory;
    });
  };
  const updateProducts = (newProducts) => {
    setProducts(newProducts);
  };
  const handleCreateProduct = async () => {
    const data = {
      id: productoForm.id,
      codigoEan13: productoForm.codigoEan13,
      nombre: productoForm.nombre,
      categoriaId: productoForm.categoriaId,
      presentacion: productoForm.presentacion,
      concentracion: productoForm.concentracion,
      precio: productoForm.precio,
      especial: productoForm.especial,
      lotes: [
        {
          numeroLote: productoForm.numeroLote,
          fechaProduccion: formatDate(
            productoForm.fechaProduccion,
            "YYYY-MM-DD"
          ),
          fechaVencimiento: formatDate(
            productoForm.fechaVencimiento,
            "YYYY-MM-DD"
          ),
        },
      ],
    };
    if (data.codigoEan13.length < 4 || data.codigoEan13.length > 14) {
      toast.warning("El código debe tener entre 4 y 14 caracteres.");
      formProductRefs.current[0].focus();
      return;
    }
    if (data.nombre.length < 5 || data.nombre.length > 50) {
      toast.warning("El nombre debe tener entre 5 y 50 caracteres.");
      formProductRefs.current[1].focus();
      return;
    }
    if (!data.presentacion.trim()) {
      toast.warning("La Presentación no debe estar vacío.");
      formProductRefs.current[2].focus();
      return;
    }
    if (!data.precio || data.precio < 0) {
      toast.warning("El precio debe ser positivo");
      formProductRefs.current[3].focus();
      return;
    }
    console.log(data);
    if (!data.lotes[0].numeroLote) {
      toast.warning("El Numero Lote no debe estar vacío.");
      formProductRefs.current[4].focus();
      return;
    }
    try {
      // setIsLoading(true);
      const { status, errorMessage } = await createProduct(data);
      switch (status) {
        case 201:
          toast.success("Producto creado correctamente.");
          handleCloseModalProduct();
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
    } // finally {
    //   setIsLoading(false);
    // }
  };
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
      productoId: selectedProduct.id,
    };
  };

  const handleCreateBatch = async () => {
    console.log(batchForm);
    if (batchForm.numeroLote.length < 4 || batchForm.numeroLote.length > 20) {
      toast.warning("El lote debe tener entre 4 y 20 caracteres.");
      formBatchRefs.current[0].focus();
      return;
    }
    try {
      // setIsLoading(true);
      const { status, errorMessage } = await createBatch(
        formatDataBatch(batchForm)
      );
      switch (status) {
        case 201:
          toast.success("Lote creado correctamente.");
          const response = await getProductForGrn(selectedProduct.codigoEan13);
          if (response.status !== 200) {
            toast.warning("lote creado pero no encontrado");
            return;
          }
          setSelectedProduct(response.data);
          const lastLote = response.data.lotes[response.data.lotes.length - 1];
          setCarForm((prev) => ({
            ...prev,
            loteId: lastLote.id,
          }));
          toast.success("El lote se ha creado correctamente");
          handleCloseModalBatch();
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
    } //finally {
    //setIsLoading(false);
    // }
  };
  const clearCalculations = () => {
    setAmounts({
      total: 0,
      igv: 0,
      subtotal: 0,
    });
  };
  const handleDeleteProduct = (deletedProduct) => {
    setHistory((prevHistory) => {
      const newHistory = prevHistory.filter(
        (entry) => entry.id !== deletedProduct.id
      );
      const subtotal = newHistory.reduce(
        (sum, entry) => sum + entry.precio * entry.stockTotal,
        0
      );
      const igv = parseFloat((subtotal * 0.18).toFixed(2));
      const total = parseFloat((subtotal + igv).toFixed(2));
      setAmounts({
        total,
        subtotal,
        igv,
      });
      return newHistory;
    });
    toast.warning("Producto eliminado correctamente");
  };
  const clearNewEntry = () => {
    resetForm();
    setDocumentProveedor("");
    setNombreCompleto("");
    setProducts([]);
  };
  const handleAddCar = () => {
    if (!carForm.loteId) {
      toast.warning("Seleccione un lote");
      formCarRefs.current[0].querySelector("input").focus(); // Enfoca el input de Lote
      return;
    }
    if (
      parseFloat(carForm.cantidad) <= 0 ||
      isNaN(parseFloat(carForm.cantidad))
    ) {
      toast.warning("La cantidad debe ser mayor a 0");
      formCarRefs.current[1].querySelector("input").focus(); // Enfoca el input de Cantidad
      return;
    }
    if (parseFloat(carForm.precio) <= 0 || isNaN(parseFloat(carForm.precio))) {
      toast.warning("El precio debe ser mayor a 0");
      formCarRefs.current[2].querySelector("input").focus(); // Enfoca el input de Precio
      return;
    }
    const productForAdd = {
      id: selectedProduct.id,
      codigoEan13: selectedProduct.codigoEan13,
      nombre: selectedProduct.nombre,
      presentacion: selectedProduct.presentacion,
      precio: parseFloat(carForm.precio),
      stockTotal: parseInt(carForm.cantidad),
      loteId: parseInt(carForm.loteId),
    };
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory, productForAdd];
      const subtotal = newHistory.reduce(
        (sum, entry) => sum + entry.precio * entry.stockTotal,
        0
      );
      const igv = parseFloat((subtotal * 0.18).toFixed(2));
      const total = parseFloat((subtotal + igv).toFixed(2));
      setAmounts({
        total: parseFloat(total.toFixed(2)),
        subtotal: subtotal,
        igv,
      });
      return newHistory;
    });
    resetCarForm();
    setSelectedProduct(null);
    toast.success("Entrada agregada correctamente");
  };

  const sendNewEntry = async () => {
    if (!history.length) {
      toast.error("No hay datos para registrar");
      return;
    }
    setIsLoading(true);
    const getEntryDetails = () =>
      history.map(({ id, stockTotal, precio, loteId }) => ({
        productoId: id,
        loteId: loteId,
        cantidad: stockTotal,
        precio: precio,
      }));
    const entry = {
      documento: form.documento,
      usuarioId: "",
      proveedor: nombreCompleto || form.proveedor,
      detalleEntrada: getEntryDetails(),
    };
    try {
      const { status, errorMessage } = await saveGoodsReceived(entry);
      switch (status) {
        case 201:
          toast.success("Entrada registrada con éxito");
          clearNewEntry();
          setHistory([]);
          clearCalculations();
          break;
        default:
          toast.warning(errorMessage[0]);
          break;
      }
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseModalBatch = () => {
    batchResetForm();
    closeModal("createBatch");
  };
  const handleCloseModalProduct = () => {
    productoResetForm();
    closeModal("createProduct");
  };
  useEffect(() => {
    if (selectedProduct?.lotes?.length > 0) {
      const lastLoteId =
        selectedProduct.lotes[selectedProduct.lotes.length - 1].id;
      setCarForm((prev) => ({
        ...prev,
        loteId: lastLoteId,
      }));
    } else {
      setCarForm((prev) => ({
        ...prev,
        loteId: "",
      }));
    }
  }, [selectedProduct]);
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="m-5 p-6 bg-gray-100 rounded-lg shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-300 shadow-lg rounded-lg p-5 bg-white md:col-span-1">
          <div className="bg-cyan-700 p-3 rounded-t-lg flex items-center">
            <p className="text-white text-lg font-semibold">Proveedor</p>
          </div>
          <div className="p-4 grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="documentProveedor" value="N° documento" />
              <TextInput
                className="mt-1 text-right"
                id="documentProveedor"
                name="documentProveedor"
                placeholder="10364665877"
                maxLength={11}
                value={documnetProveedor}
                onChange={handleDocumentChange}
                onInput={handleDocumentChange}
              />
            </div>
            <div>
              <Label
                htmlFor="proveedorName"
                value={loadingRuc ? <Spinner size="md" /> : "Nombre completo"}
              />
              <TextInput
                className="mt-1 font-bold"
                id="proveedorName"
                name="proveedorName"
                placeholder="Ejem: Bayer S.A."
                value={nombreCompleto || form.proveedor}
                onChange={(e) => {
                  handleChange(e);
                  setNombreCompleto(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="border border-gray-300 shadow-lg rounded-lg p-5 bg-white md:col-span-1">
          <div className="bg-cyan-700 p-3 rounded-t-lg flex items-center">
            <p className="text-white text-lg font-semibold">Detalle</p>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="documento"
              name="documento"
              value={form.documento}
              onChange={handleChange}
              className="mt-1"
            >
              <option value="Factura" defaultValue>
                Factura
              </option>
              <option value="Boleta">Boleta</option>
            </Select>
            <TextInput
              addon="Subtotal"
              name="subTotal"
              value={amounts.subtotal}
              readOnly
            />
            <TextInput
              addon="IGV(18.00%)"
              name="igv"
              value={amounts.igv}
              readOnly
            />
            <TextInput
              addon="Total"
              name="total"
              value={amounts.total}
              readOnly
            />
          </div>
          <div className="p-4">
            <Button
              onClick={sendNewEntry}
              disabled={!history.length || isLoading}
              className={`w-full px-5 py-3 text-base font-medium text-center text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                ${
                  isLoading
                    ? "bg-cyan-700 opacity-70 cursor-not-allowed animate-pulse"
                    : "bg-cyan-700 hover:bg-cyan-600"
                }`}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 text-white animate-spin" />
                  Cargando...
                </>
              ) : (
                "Guardar Entrada"
              )}
            </Button>
          </div>
        </div>
        <div className="border border-gray-300 shadow-lg rounded-lg bg-white md:col-span-2">
          <div className="bg-cyan-700 p-3 rounded-t-lg flex items-center">
            <p className="text-white text-lg font-semibold">Producto</p>
          </div>

          <div className="p-6 space-y-4 md:space-y-0 md:flex md:gap-6 items-start">
            {/* Formulario de búsqueda por nombre */}
            <div className="flex flex-col w-full md:w-1/2 relative">
              <Label
                htmlFor="nombreProducto"
                value="Buscar nombre"
                className="text-gray-700 font-medium"
              />
              <TextInput
                id="nombreProducto"
                type="text"
                placeholder="Buscar nombre ..."
                value={searchValue}
                onChange={(event) => {
                  event.preventDefault();
                  setSearchValue(event.target.value);
                  handleSearchProductByName(event);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 500)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && searchResults.length > 0) {
                    event.preventDefault();
                    handleSelectProduct(searchResults[0]);
                  }
                }}
                className="rounded-lg shadow-sm focus:ring-cyan-600 focus:border-cyan-600 mt-1"
              />

              {/* Sugerencias de búsqueda */}
              {showSuggestions && searchResults.length > 0 && (
                <div className="left-0 right-0  shadow-md rounded-md border border-gray-300 mt-1 max-h-40 overflow-y-auto z-10">
                  <ul className="absolute divide-y bg-white divide-gray-200 w-full rounded-b-lg">
                    {searchResults.map((product) => (
                      <li
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="flex items-center px-3 py-2 cursor-pointer text-sm border-none last:rounded-b-lg
                        hover:bg-cyan-100 active:bg-gray-200"
                      >
                        <BeakerIcon className="text-cyan-700 w-4 h-4 mr-2" />
                        <span className="text-gray-700">{product.nombre}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Formulario de código de producto */}
            <form
              onSubmit={handleChangeProduct}
              className="flex flex-col w-full md:w-1/2"
            >
              <Label
                htmlFor="codigoProducto"
                value="Producto"
                className="text-gray-700 font-medium"
              />
              <TextInput
                ref={inputProductRef}
                id="codigoProducto"
                name="codigoProducto"
                placeholder="Ingresa el código del producto"
                type="tel"
                value={form.codigoProducto}
                onChange={handleChange}
                className=" shadow-sm focus:ring-cyan-600 focus:border-cyan-600 mt-1"
              />
            </form>

            <div className="flex w-full md:w-1/2 items-center gap-4">
              <Button
                onClick={() => {
                  setIsEdit(false);
                  openModal("createProduct");
                }}
                className="flex-grow text-white font-medium py-2 mt-3 rounded-lg hover:bg-cyan-600 transition-all duration-200"
              >
                <ShoppingBagIcon className="size-5" />
                Nuevo Producto
              </Button>
            </div>
          </div>

          {/* Formulario nueva entrada */}
          <div className="flex items-end gap-4 p-6">
            {/* Campo Nombre del Producto */}
            <div className="flex-1">
              <Label htmlFor="productoNombre" value="Nombre del Producto" />
              <TextInput
                id="productoNombre"
                placeholder="producto seleccionado"
                readOnly
                value={selectedProduct?.nombre || ""}
                className="mt-1 w-full"
              />
            </div>

            {/* Campo Lotes */}
            <div className="flex-1" ref={(el) => (formCarRefs.current[0] = el)}>
              <Label htmlFor="loteId" value="Lotes" />
              <Select
                id="loteId"
                name="loteId"
                className="mt-1 w-full"
                disabled={!selectedProduct}
                value={carForm.loteId}
                onChange={handleCarFormChange}
              >
                <option value="">Seleccione un lote</option>
                {selectedProduct?.lotes?.length > 0 ? (
                  selectedProduct.lotes.map((lote) => (
                    <option key={lote.id} value={lote.id}>
                      {lote.numeroLote}
                    </option>
                  ))
                ) : (
                  <option value="">Sin lotes</option>
                )}
              </Select>
            </div>

            {/* Campo Cantidad */}
            <div className="flex-1" ref={(el) => (formCarRefs.current[1] = el)}>
              <Label htmlFor="cantidad" value="Cantidad" />
              <TextInput
                id="cantidad"
                name="cantidad"
                type="number"
                min={1}
                className="mt-1 w-full"
                placeholder="0"
                value={carForm.cantidad}
                onChange={handleCarFormChange}
              />
            </div>

            {/* Campo Precio */}
            <div className="flex-1" ref={(el) => (formCarRefs.current[2] = el)}>
              <Label htmlFor="precio" value="Precio" />
              <TextInput
                id="precio"
                name="precio"
                type="number"
                min={0.1}
                step="0.1"
                className="mt-1 w-full"
                placeholder="0.00"
                value={carForm.precio}
                onChange={handleCarFormChange}
              />
            </div>

            {/* Botón Nuevo Lote */}
            <Button
              onClick={() => openModal("createBatch")}
              disabled={!selectedProduct}
              className={`flex-shrink-0 bg-cyan-600 py-2 px-2 transition-all duration-200 ${
                !selectedProduct
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-cyan-700"
              }`}
            >
              <InboxArrowDownIcon className="size-5" />
              Nuevo Lote
            </Button>
            <Button
              onClick={handleAddCar}
              disabled={!selectedProduct}
              className="flex-shrink-0 bg-cyan-700 py-2 px-2 transition-all duration-200 "
            >
              <ShoppingCartIcon className="size-5" />
              Agregar
            </Button>
          </div>
          <Table
            columnProperties={columnProperties}
            data={history}
            currentPage={currentPage}
            pagination={false}
            onPageChange={onPageChange}
            fnDelete={handleDeleteProduct}
            fnActions={[
              {
                name: <span className="text-white font-extrabold">+</span>,
                fn: handlePlusProduct,
              },
              {
                name: <span className="text-white font-extrabold">-</span>,
                fn: handleMinusEntry,
              },
            ]}
            positionActions="start"
          />
        </div>
        <ModalProductForm
          form={productoForm}
          onChange={productoChange}
          onCheckChange={productoCheckChange}
          show={showModal.createProduct}
          onCloseModal={handleCloseModalProduct}
          isEdit={isEdit}
          fnCreate={handleCreateProduct}
          formRefs={formProductRefs}
        />
        <ModalBatchForm
          form={batchForm}
          onChange={batchChange}
          onCheckChange={batchCheckChange}
          show={showModal.createBatch}
          onCloseModal={handleCloseModalBatch}
          fnCreate={handleCreateBatch}
          formRefs={formBatchRefs}
        />
      </div>
    </>
  );
};

export default GoodsReceivedPage;
