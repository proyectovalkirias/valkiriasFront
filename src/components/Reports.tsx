"use client";

import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

const Reports: React.FC = () => {
  useEffect(() => {
    // Crear cada gráfico de forma independiente
    const chartsConfig = [
      {
        id: "barChart",
        options: {
          chart: { type: "bar", height: 400 },
          series: [{ name: "Ventas", data: [50, 70, 40, 90, 80, 120] }],
          xaxis: {
            categories: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
          },
          colors: ["#4CAF50"],
          title: { text: "Ventas Mensuales", align: "center" },
        },
      },
      {
        id: "lineChart",
        options: {
          chart: {
            type: "line",
            height: 400,
            toolbar: {
              show: true, // Mostrar o esconder el toolbar
              offsetX: 25, // Desplazamiento horizontal
              offsetY: -18, // Desplazamiento vertical
              tools: {
                download: true, // Habilitar/Deshabilitar descarga
                selection: true, // Habilitar/Deshabilitar selección
                zoom: true, // Habilitar/Deshabilitar zoom
                zoomin: true, // Habilitar/Deshabilitar acercar
                zoomout: true, // Habilitar/Deshabilitar alejar
                pan: true, // Habilitar/Deshabilitar paneo
                reset: true, // Habilitar/Deshabilitar resetear
              },
            },
          },
          series: [
            { name: "Usuarios Activos", data: [100, 200, 150, 300, 250, 400] },
          ],
          xaxis: {
            categories: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
          },
          colors: ["#FF5733"],
          title: { text: "Crecimiento de Usuarios", align: "center" },
        },
      },
      {
        id: "areaChart",
        options: {
          chart: {
            type: "area",
            height: 400,
            toolbar: {
              show: true, // Mostrar o esconder el toolbar
              offsetX: 25, // Desplazamiento horizontal
              offsetY: -18, // Desplazamiento vertical
              tools: {
                download: true, // Habilitar/Deshabilitar descarga
                selection: true, // Habilitar/Deshabilitar selección
                zoom: true, // Habilitar/Deshabilitar zoom
                zoomin: true, // Habilitar/Deshabilitar acercar
                zoomout: true, // Habilitar/Deshabilitar alejar
                pan: true, // Habilitar/Deshabilitar paneo
                reset: true, // Habilitar/Deshabilitar resetear
              },
            },
          },
          series: [{ name: "Ingresos", data: [200, 400, 300, 600, 500, 800] }],
          xaxis: {
            categories: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
          },
          colors: ["#007BFF"],
          title: { text: "Ingresos Totales", align: "center" },
        },
      },
    ];

    // Renderizar todos los gráficos
    const renderedCharts = chartsConfig.map((config) => {
      const chart = new ApexCharts(
        document.querySelector(`#${config.id}`),
        config.options
      );
      chart.render();
      return chart;
    });

    // Limpiar gráficos al desmontar
    return () => {
      renderedCharts.forEach((chart) => chart.destroy());
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
        Panel de Reportes
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          id="barChart"
          className="bg-white shadow-md rounded p-4 min-h-[500px]"
        ></div>
        <div
          id="lineChart"
          className="bg-white shadow-md rounded p-4 min-h-[500px]"
        ></div>
        <div
          id="areaChart"
          className="bg-white shadow-md rounded p-4 min-h-[500px]"
        ></div>
      </div>
    </div>
  );
};

export default Reports;
