import ReactApexChart from "react-apexcharts";
import { getDataFrequencyGraph } from "../../../services/chart";
import { useEffect, useState } from "react";

const GraficoProductsStock = () => {
  const [chartData, setChartData] = useState({
    series: [{ name: "Productos Stock", data: [] }],
    options: {
      chart: {
        height: 350,
        type: "bar",
        toolbar: { show: false, tools: { download: false } },
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: "top",
          },
          colors: {
            ranges: [
              {
                from: 0,
                to: 20,
                color: "#FFA500", // Naranja para stock bajo
              },
            ],
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"],
        },
      },
      xaxis: {
        categories: [],
        position: "top",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + "";
          },
        },
      },
      title: {
        text: "Stock Disponible de los productos",
        floating: true,
        offsetY: 330,
        align: "center",
        style: {
          color: "#0891B2",
          fontFamily: "cursive",
          fontSize: "16px",
          fontWeight: "bold",
        },
      },
    },
  });
  const fetchData = async () => {
    try {
      const { data } = await getDataFrequencyGraph();
      const { labels, values } = data;
      setChartData((prevState) => ({
        ...prevState,
        series: [{ name: "Productos Stock", data: values || [] }],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: labels || [],
          },
        },
      }));
    } catch {
      toast.warning("Error al cargar los datos del gráfico de stock");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ReactApexChart
      options={chartData.options}
      series={chartData.series}
      type="bar"
      height={350}
    />
  );
};

export default GraficoProductsStock;
