import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getDataBarChart } from "../../../services/chart";
import { toast } from "sonner";

const GraficoVentas = () => {
  const [barChartData, setBarChartData] = useState({
    options: {
      chart: {
        height: 350,
        type: "bar",
        toolbar: { show: false, tools: { download: false } },
      },
      plotOptions: { bar: { horizontal: true } },
      colors: ["#00E396"],
      dataLabels: {},
      legend: {
        show: true,
        customLegendItems: ["Venta", "Venta Esperada"],
        markers: { fillColors: ["#00E396", "#775DD0"] },
      },
      title: {
        text: "Ventas",
        align: "center",
        style: {
          fontSize: "20px",
          fontWeight: "bold",
          color: "#0891B2",
          fontFamily: "cursive",
        },
      },
    },
    series: [{ name: "Venta", data: [] }],
  });
  const fetchBarChartData = async () => {
    try {
      const { data } = await getDataBarChart();

      const barSeriesData = data.data.map((item) => ({ x: item.x, y: item.y }));
      setBarChartData((prevState) => ({
        ...prevState,
        series: [{ ...prevState.series[0], data: barSeriesData }],
      }));
    } catch (error) {
      toast.warning("Error fetching bar chart data");
    }
  };

  useEffect(() => {
    fetchBarChartData();
  }, []);

  return (
    <ReactApexChart
      options={barChartData.options}
      series={barChartData.series}
      type="bar"
      height={350}
    />
  );
};

export default GraficoVentas;
