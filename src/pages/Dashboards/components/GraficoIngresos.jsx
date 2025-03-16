import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ReactApexChart from "react-apexcharts";
import { getDataLineChart } from "../../../services/chart";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/solid";
const GraficoIngresos = () => {
  const [lineChartData, setLineChartData] = useState({
    options: {
      chart: {
        height: 350,
        type: "area",
        zoom: {
          enabled: false, // Deshabilitar zoom
        },
        toolbar: { show: false, tools: { download: false } },
      },
      dataLabels: { enabled: false },
      colors: ["#77B6EA", "#FDBA8C"],
      stroke: { curve: "smooth" },
      markers: { size: 5, hover: { size: 9 } },
      xaxis: { categories: [] },
      title: { text: "Ingresos por Fecha" },
    },
    series: [
      { name: "Ingresos", data: [] },
      { name: "Ingresos Anteriores", data: [] },
    ],
    percentageGrowth: "",
    sumRevenue: "",
  });
  function replaceZerosWithNull(data) {
    if (Array.isArray(data.revenue)) {
      data.revenue = data.revenue.map((value) => (value === 0 ? null : value));
    }
    if (Array.isArray(data.previousRevenue)) {
      data.previousRevenue = data.previousRevenue.map((value) =>
        value === 0 ? null : value
      );
    }
    if (typeof data.percentageGrowth === "number") {
      data.percentageGrowth = parseFloat(data.percentageGrowth.toFixed(2));
    }
    return data;
  }
  const fetchData = async () => {
    try {
      const { data } = await getDataLineChart();
      const updatedData = replaceZerosWithNull(data);
      setLineChartData({
        options: {
          ...lineChartData.options,
          title: {
            text: updatedData.period,
          },
          xaxis: {
            categories: updatedData.days,
          },
        },
        series: [
          {
            name: "Ingresos",
            data: updatedData.revenue,
          },
          {
            name: "Ingresos Anteriores",
            data: updatedData.previousRevenue,
          },
        ],
        percentageGrowth: updatedData.percentageGrowth,
        sumRevenue: updatedData.sumRevenue,
      });
    } catch (error) {
      toast.warning("Error al cargar los datos del gráfico de ingresos");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <h2 className="text-right text-xl font-bold">
          {`S/ ${lineChartData.sumRevenue}`}
        </h2>
        <h2
          className={`text-right text-xl font-bold flex items-center ${
            lineChartData.percentageGrowth >= 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {lineChartData.percentageGrowth >= 0 ? (
            <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
          ) : (
            <ArrowTrendingDownIcon className="h-5 w-5 mr-2" />
          )}
          {`${lineChartData.percentageGrowth}%`}
        </h2>
      </div>
      <ReactApexChart
        options={lineChartData.options}
        series={lineChartData.series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default GraficoIngresos;
