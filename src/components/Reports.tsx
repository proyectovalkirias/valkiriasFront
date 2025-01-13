"use client";
import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import axios from "axios";

const Reports: React.FC = () => {
  const [chartsData, setChartsData] = useState<{
    ventas: number[];
    usuariosActivos: number[];
    ingresos: number[];
    categorias: string[];
  }>({
    ventas: [0, 0, 0, 0, 0, 0], // Valores iniciales de ejemplo
    usuariosActivos: [0, 0, 0, 0, 0, 0], // Valores iniciales de ejemplo
    ingresos: [0, 0, 0, 0, 0, 0], // Valores iniciales de ejemplo
    categorias: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"], // Categorías iniciales
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getToken = () => {
          const user = localStorage.getItem("user");

          if (!user) {
            console.error("No hay datos del usuario en localStorage");
            return null;
          }

          try {
            const parsedUser = JSON.parse(user);
            return parsedUser.token || null;
          } catch (err) {
            console.error("Error al parsear los datos del usuario:", err);
            return null;
          }
        };

        const token = getToken();

        if (token) {
          console.log("Token extraído:", token);
        } else {
          console.error("No se encontró el token.");
        }
        const [ventasResponse, usuariosResponse, ingresosResponse] =
          await Promise.all([
            axios.get("https://valkiriasback.onrender.com/sale/by-month", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("https://valkiriasback.onrender.com/users", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("https://valkiriasback.onrender.com/sale/total", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        console.log("Ventas data:", ventasResponse.data);
        console.log("Usuarios data:", usuariosResponse.data);
        console.log("Ingresos data:", ingresosResponse.data);

        setChartsData({
          ventas: ventasResponse.data.data || [0, 0, 0, 0, 0, 0],
          usuariosActivos: usuariosResponse.data.length
            ? Array(6).fill(usuariosResponse.data.length)
            : [0, 0, 0, 0, 0, 0],
          ingresos: ingresosResponse.data.data || [0, 0, 0, 0, 0, 0],
          categorias: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"], // Datos estáticos
        });
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (
      !chartsData.ventas ||
      !chartsData.usuariosActivos ||
      !chartsData.ingresos
    ) {
      console.log("Los datos para los gráficos están incompletos.");
      return;
    }

    console.log("chartsData actualizado:", chartsData);

    const chartsConfig = [
      {
        id: "barChart",
        options: {
          chart: { type: "bar", height: 400 },
          series: [{ name: "Ventas", data: chartsData.ventas }],
          xaxis: { categories: chartsData.categorias },
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
            toolbar: { show: true },
          },
          series: [
            {
              name: "Usuarios Activos",
              data: chartsData.usuariosActivos,
            },
          ],
          xaxis: { categories: chartsData.categorias },
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
            toolbar: { show: true },
          },
          series: [{ name: "Ingresos", data: chartsData.ingresos }],
          xaxis: { categories: chartsData.categorias },
          colors: ["#007BFF"],
          title: { text: "Ingresos Totales", align: "center" },
        },
      },
    ];

    const renderedCharts = chartsConfig.map((config) => {
      const element = document.querySelector(`#${config.id}`);
      if (!element) {
        console.error(`No se encontró el elemento con id ${config.id}`);
        return null;
      }

      const chart = new ApexCharts(element, config.options);
      chart.render();
      return chart;
    });

    return () => {
      renderedCharts.forEach((chart) => chart?.destroy());
    };
  }, [chartsData]);

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
