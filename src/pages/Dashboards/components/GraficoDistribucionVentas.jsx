import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { getDataDistribucionVentasGraph } from "../../../services/chart";
import { TrophyIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";

const GraficoDistribucionVentas = () => {
  const [donutChartData, setDonutChartData] = useState({
    options: {
      chart: {
        type: "donut",
      },
      labels: [], // Inicialmente vacío
      title: {
        text: "Top 5 productos más vendidos", // Título del gráfico
        align: "center", // Alineación del título
        style: {
          fontSize: "20px", // Tamaño de fuente del título
          fontWeight: "bold", // Peso de la fuente
          color: "#0891B2",
          fontFamily: "cursive",
        },
      },
    },
    series: [], // Inicialmente vacío
  });
  // Aquí simulas que obtienes el payload desde el servicio, por ejemplo, de la siguiente forma:
  const fetchData = async () => {
    try {
      const response = await getDataDistribucionVentasGraph(); // Suponiendo que esto obtiene el payload
      const data = response.data;

      // Actualiza el estado con los datos recibidos
      setDonutChartData({
        options: {
          chart: {
            type: "donut",
          },
          labels: data.labels, // Asignamos las etiquetas del payload
          title: {
            text: "Top 5 productos más vendidos", // Título del gráfico
            align: "center", // Alineación del título
            style: {
              fontSize: "20px", // Tamaño de fuente del título
              fontWeight: "bold", // Peso de la fuente
              color: "#0891B2",
              fontFamily: "cursive",
            },
          },
        },
        series: data.values, // Asignamos los valores del payload
      });
    } catch {
      toast.warning(
        "Error al cargar los datos del gráfico de distribución de ventas"
      );
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ReactApexChart
      options={donutChartData.options}
      series={donutChartData.series}
      type="donut"
      height={350}
    />
  );
};

export default GraficoDistribucionVentas;
