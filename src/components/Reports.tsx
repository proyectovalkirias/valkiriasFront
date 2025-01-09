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
          chart: { type: "bar", height: 350 },
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
          chart: { type: "line", height: 350 },
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
          chart: { type: "area", height: 350 },
          series: [{ name: "Ingresos", data: [200, 400, 300, 600, 500, 800] }],
          xaxis: {
            categories: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
          },
          colors: ["#007BFF"],
          title: { text: "Ingresos Totales", align: "center" },
        },
      },
      {
        id: "pieChart",
        options: {
          chart: { type: "pie", height: 350 },
          series: [30, 25, 20, 15, 10],
          labels: ["Electrónica", "Ropa", "Alimentos", "Juguetes", "Otros"],
          colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
          title: {
            text: "Distribución de Ventas por Categoría",
            align: "center",
          },
        },
      },
      {
        id: "radialChart",
        options: {
          chart: { type: "radialBar", height: 350 },
          series: [85],
          labels: ["Meta de Ventas"],
          colors: ["#00E396"],
          title: { text: "Progreso de Meta de Ventas", align: "center" },
        },
      },
      {
        id: "heatmapChart",
        options: {
          chart: { type: "heatmap", height: 350 },
          series: [
            {
              name: "Producto A",
              data: [10, 20, 30, 40, 50, 60],
            },
            {
              name: "Producto B",
              data: [20, 30, 40, 50, 60, 70],
            },
            {
              name: "Producto C",
              data: [30, 40, 50, 60, 70, 80],
            },
          ],
          xaxis: { categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"] },
          colors: ["#008FFB"],
          title: { text: "Heatmap de Ventas por Producto", align: "center" },
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
          className="bg-white shadow-md rounded p-4 min-h-[400px]"
        ></div>
        <div
          id="lineChart"
          className="bg-white shadow-md rounded p-4 min-h-[400px]"
        ></div>
        <div
          id="areaChart"
          className="bg-white shadow-md rounded p-4 min-h-[400px]"
        ></div>
        <div
          id="pieChart"
          className="bg-white shadow-md rounded p-4 min-h-[400px]"
        ></div>
        <div
          id="radialChart"
          className="bg-white shadow-md rounded p-4 min-h-[400px]"
        ></div>
        <div
          id="heatmapChart"
          className="bg-white shadow-md rounded p-4 min-h-[400px]"
        ></div>
      </div>
    </div>
  );
};

export default Reports;
