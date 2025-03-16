import React, { useEffect, useState } from "react";
import { getReportEntriesDownload, getReportGrn } from "../../services/reporte";
import usePagination from "../../hooks/usePagination";
import useForm from "../../hooks/useForm";
import { formatDate } from "../../utils/utils";
import { toast, Toaster } from "sonner";
import { Label, Spinner } from "flowbite-react";
import Table from "../../components/Table";
import Datepicker from "../../components/Datepicker";
import ExcelJS from "exceljs";
import ExcelIcon2 from "../../assets/icons/ExcelIcon2";

const columnProperties = [
  { name: "fecha", property: "fechaRegistro", type: "date" },
  { name: "Correlativo", property: "correlativo" },
  { name: "Documento", property: "documento" },
  { name: "Proveedor", property: "proveedor" },
  { name: "Producto", property: "nombreProducto" },
  { name: "Numero de Lote", property: "loteNumero" },
  { name: "Cantidad", property: "cantidad" },
  { name: "Precio", property: "precio" },
  { name: "Sub Total", property: "subTotal" },
  { name: "Estado", property: "estado", type: "boolean" },
];

const getLast7Days = () => {
  const today = new Date();
  today.setDate(today.getDate() - 7);
  return today;
};

const ReportEntriesPage = () => {
  const {
    currentPage,
    totalPages,
    onPageChange,
    setTotalPages,
    resetPagination,
  } = usePagination();

  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { form, handleChange, setForm } = useForm({
    fromDate: getLast7Days(),
    toDate: new Date(),
  });

  const fetchData = async (pageNumber = 1, pageSize = 10) => {
    try {
      const params = {
        pageNumber,
        pageSize,
      };
      params.startDate = formatDate(form.fromDate, "YYYY-MM-DD");
      params.endDate = formatDate(form.toDate, "YYYY-MM-DD");
      const { status, data, totalPages: tp } = await getReportGrn(params);
      switch (status) {
        case 200:
          setReportData(data);
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

  const handleDownloadEntries = async () => {
    setIsLoading(true);
    try {
      const params = {
        startDate: formatDate(form.fromDate, "YYYY-MM-DD"),
        endDate: formatDate(form.toDate, "YYYY-MM-DD"),
      };
      const { status, data } = await getReportEntriesDownload(params);
      switch (status) {
        case 200:
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Reporte de Entradas");
          worksheet.columns = [
            { header: "Fecha", key: "fechaRegistro", width: 15 },
            { header: "Correlativo", key: "correlativo", width: 15 },
            { header: "Documento", key: "documento", width: 20 },
            { header: "Proveedor", key: "proveedor", width: 20 },
            { header: "Producto", key: "nombreProducto", width: 20 },
            { header: "Numero de Lote", key: "loteNumero", width: 10 },
            { header: "Cantidad", key: "cantidad", width: 10 },
            { header: "Precio", key: "precio", width: 15 },
            { header: "Sub Total", key: "subTotal", width: 15 },
            { header: "Estado", key: "estado", width: 15 },
          ];
          data.forEach((item) => {
            if (item.fechaRegistro) {
              const date = new Date(item.fechaRegistro);
              item.fechaRegistro = formatDate(date, "YYYY-MM-DD HH:mm:ss");
            }
            worksheet.addRow(item);
          });

          const buffer = await workbook.xlsx.writeBuffer();
          const excelBlob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(excelBlob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Reporte_Entradas.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          break;
        default:
          toast.warning(`error no controlado code : ${status}`);
      }
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (form.fromDate > form.toDate) {
      setForm((prevForm) => ({
        ...prevForm,
        fromDate: form.toDate,
      }));
      return;
    }
    fetchData(currentPage);
  }, [form.fromDate, form.toDate, currentPage]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="m-5 p-5 shadow-2xl rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center md:text-left">
          Reportes de Entradas
        </h2>

        <div className="p-6 rounded-lg  mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <Label
                htmlFor="fromDate"
                value="Desde"
                className="text-gray-700 mb-1 block"
              />
              <div className="h-full">
                <Datepicker
                  id="fromDate"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  labelTodayButton="Hoy"
                  labelClearButton="Limpiar"
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="toDate"
                value="Hasta"
                className="text-gray-700 mb-1 block"
              />
              <div className="h-full">
                <Datepicker
                  id="toDate"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  labelTodayButton="Hoy"
                  labelClearButton="Limpiar"
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-end h-full">
              <button
                onClick={handleDownloadEntries}
                className="flex items-center justify-center gap-2 bg-cyan-700 text-white w-full h-11 rounded-lg hover:bg-cyan-500 transition duration-300 shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <ExcelIcon2 className="size-6" />
                    Descargar Entradas
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <Table
          data={reportData}
          columnProperties={columnProperties}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default ReportEntriesPage;
