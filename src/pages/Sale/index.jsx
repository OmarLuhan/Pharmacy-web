import { Button, Label, Spinner, TextInput } from "flowbite-react";
import useForm from "../../hooks/useForm";
import Table from "../../components/Table";
import { useRef, useState, useCallback } from "react";
import debounce from "lodash/debounce";
import {
  getProductForSale,
  getProductForSaleName,
} from "../../services/product";
import { toast, Toaster } from "sonner";
import { createSale } from "../../services/sale";
import { searchDni } from "../../services/dniquery/dni";
import { BeakerIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

const columnProperties = [
  { name: "Código", property: "codigoEan13" },
  { name: "Producto", property: "nombre" },
  { name: "Cantidad", property: "cantidad" },
  { name: "Precio", property: "precio" },
  { name: "Total", property: "total" },
];

const SalePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const inputProductRef = useRef(null);
  const isSelecting = useRef(false);
  const [searchValue, setSearchValue] = useState("");
  const [loadingDni, setLoadingDni] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [dniCliente, setDniCliente] = useState("");

  const { form, handleChange, clearField, resetForm } = useForm({
    usuarioId: "",
    clienteDni: "",
    clienteNombre: "",
    codigoProducto: "",
    subTotal: 0,
    igv: 0,
    total: 0,
  });

  const [amounts, setAmounts] = useState({
    total: 0,
    igv: 0,
    subtotal: 0,
  });

  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchClientData = async (dni) => {
    setLoadingDni(true);
    try {
      const { success, message, data } = await searchDni({
        dni: dni.trim(),
      });
      if (!success) throw new Error(message);
      setNombreCompleto(data.apellido_paterno + " " + data.nombres);
    } catch (e) {
      toast.warning(`${e}`);
    } finally {
      setLoadingDni(false);
    }
  };
  const debouncedSearch = useCallback(
    debounce(async (searchValue) => {
      if (searchValue.trim() === "") return;
      if (searchValue.length === 8 && /^\d+$/.test(searchValue)) {
        await fetchClientData(searchValue);
      }
    }, 500),
    []
  );
  const handleDniChange = (e) => {
    e.preventDefault();
    const value = e.currentTarget.value;
    if (value.length < 8) setNombreCompleto("");
    setDniCliente(value);
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
      const { status, data } = await getProductForSaleName(value);
      if (!status == 200) {
        setSearchResults([]);
        toast.warning("No se encontraron productos");
      }
      setSearchResults(data);
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
      handlePlusProduct({ codigoEan13: selectedProduct.codigoEan13 });
    } else {
      const product = {
        ...selectedProduct,
        cantidad: 1,
        total: selectedProduct.precio || 0,
      };
      updateProducts([...products, product]);
      toast.success("Producto añadido");
    }
    setSearchValue("");
    setSearchResults([]);
    setShowSuggestions(false);
  };
  const handleChangeProduct = async (evt) => {
    evt.preventDefault();
    const code = form.codigoProducto.trim();
    if (!code) return;
    const productExists = products.some((p) => p.codigoEan13 === code);
    if (productExists) {
      handlePlusProduct({ codigoEan13: code });
      clearField("codigoProducto");
      return;
    }
    try {
      const { status, data } = await getProductForSale(code);
      if (status !== 200) {
        toast.warning("producto no encontrado");
        return;
      }
      const { stockDisponible, precio } = data;
      if (stockDisponible < 1) {
        toast.warning("No hay stock disponible");
        return;
      }
      const product = {
        ...data,
        cantidad: 1,
        total: precio || 0,
      };
      updateProducts([...products, product]);
      clearField("codigoProducto");
      toast.success("Producto añadido.");
    } catch (e) {
      clearField("codigoProducto");
      toast.error(`${e}`);
    }
  };
  const handleDeleteProduct = (deletedProduct) => {
    const newProducts = products.filter(
      (p) => p.codigoEan13 !== deletedProduct.codigoEan13
    );
    updateProducts(newProducts);
    toast.warning("Se ha eliminado el producto");
  };
  const handlePlusProduct = ({ codigoEan13 }) => {
    const newProducts = products.map((p) => {
      if (p.codigoEan13 !== codigoEan13) return p;
      const newQuantity = p.cantidad + 1;
      if (p.stockDisponible < newQuantity) {
        toast.warning("No hay stock disponible");
        return p;
      }
      toast.success("Producto sumado con exito.");
      return {
        ...p,
        cantidad: newQuantity,
        total: (newQuantity * p.precio).toFixed(2),
      };
    });
    updateProducts(newProducts);
  };
  const handleMinusProduct = ({ codigoEan13 }) => {
    const newProducts = products
      .map((p) => {
        if (p.codigoEan13 !== codigoEan13) return p;

        const newQuantity = p.cantidad - 1;
        if (newQuantity <= 0) {
          toast.warning("Se ha eliminado el producto");
          return null;
        }
        return {
          ...p,
          cantidad: newQuantity,
          total: (newQuantity * p.precio).toFixed(2),
        };
      })
      .filter(Boolean);
    updateProducts(newProducts);
  };
  const calculateAmounts = (products) => {
    let total = products.reduce(
      (total, { precio, cantidad }) => total + precio * cantidad,
      0
    );
    total = parseFloat(total.toFixed(2));
    const subtotal = parseFloat((total / 1.18).toFixed(2));
    const igv = parseFloat((subtotal * 0.18).toFixed(2));
    setAmounts({ total, igv, subtotal });
  };
  const updateProducts = (newProducts) => {
    setProducts(newProducts);
    calculateAmounts(newProducts);
  };

  const sendSale = async () => {
    setIsLoading(true);
    const saleDetails = products.map(({ id, cantidad }) => ({
      productoId: id,
      cantidad,
    }));
    const sale = {
      usuarioId: "",
      clienteDni: dniCliente,
      clienteNombre: nombreCompleto || form.clienteNombre,
      detalleVenta: saleDetails,
    };
    try {
      const { status, errorMessage } = await createSale(sale);
      switch (status) {
        case 201:
          toast.success("Venta registrada con éxito");
          clearSale();
          break;
        default:
          toast.warning(errorMessage[0]);
          break;
      }
    } catch (e) {
      toast.error(`${e}`);
    } finally {
      setIsLoading(false);
    }
  };
  const clearSale = () => {
    resetForm();
    setProducts([]);
    calculateAmounts([]);
    setNombreCompleto("");
  };
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="m-5 p-6 bg-gray-100 rounded-lg shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fila 1: Cliente y Detalle */}
        <div className="border border-gray-300 shadow-lg rounded-lg p-5 bg-white md:col-span-1">
          <div className="bg-cyan-700 p-3 rounded-t-lg flex items-center">
            <p className="text-white text-lg font-semibold">Cliente</p>
          </div>
          <div className="p-4 grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="clienteDni" value="N° documento" />
              <TextInput
                className="mt-1 text-right"
                id="clienteDni"
                name="clienteDni"
                placeholder="Ingresa el DNI del cliente"
                maxLength={8}
                value={dniCliente}
                onChange={handleDniChange}
                onInput={handleDniChange}
              />
            </div>
            <div>
              <Label
                htmlFor="clienteNombre"
                value={loadingDni ? <Spinner size="md" /> : "Nombre completo"}
              />
              <TextInput
                className="mt-1 font-bold"
                id="clienteNombre"
                name="clienteNombre"
                placeholder="Ejem: Juan Perez"
                value={nombreCompleto || form.clienteNombre}
                onChange={(e) => handleChange(e)}
                readOnly={nombreCompleto ? true : false}
              />
            </div>
          </div>
        </div>

        <div className="border border-gray-300 shadow-lg rounded-lg p-5 bg-white md:col-span-1">
          <div className="bg-cyan-700 p-3 rounded-t-lg flex items-center">
            <p className="text-white text-lg font-semibold">Detalle</p>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              addon="Tipo Documento"
              name="tipoDocumento"
              value="Boleta"
              readOnly
            />
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
              onClick={sendSale}
              disabled={!products.length || isLoading}
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
                "Terminar venta"
              )}
            </Button>
          </div>
        </div>

        {/* Fila 2: Producto */}
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
          </div>

          {/* Tabla de productos */}
          <div className="p-4">
            <Table
              data={products}
              columnProperties={columnProperties}
              pagination={false}
              fnDelete={handleDeleteProduct}
              fnActions={[
                {
                  name: <span className="text-white font-extrabold">+</span>,
                  fn: handlePlusProduct,
                },
                {
                  name: <span className="text-white font-extrabold">-</span>,
                  fn: handleMinusProduct,
                },
              ]}
              positionActions="start"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SalePage;
