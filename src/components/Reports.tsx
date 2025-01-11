"use client";
import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import axios from "axios";

const Reports: React.FC = () => {
  const [chartsData, setChartsData] = useState<{
    ventas?: number[];
    usuariosActivos?: number[];
    ingresos?: number[];
    categorias?: string[];
  }>({});
  const getToken = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      console.error("No hay datos del usuario en localStorage");
      return null;
    }

    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.token || null; // Retorna el token si existe
    } catch (err) {
      console.error("Error al parsear los datos del usuario:", err);
      return null;
    }
  };

  // Ejemplo de uso:
  const token = getToken();
  if (token) {
    console.log("Token extraído:", token);
  } else {
    console.log("No se encontró el token.");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        setChartsData({
          ventas: ventasResponse.data.data, // Ajusta según la estructura de la respuesta
          usuariosActivos: usuariosResponse.data.data,
          ingresos: ingresosResponse.data.data,
          categorias: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"], // Ejemplo estático
        });
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (
      !chartsData.ventas ||
      !chartsData.usuariosActivos ||
      !chartsData.ingresos
    ) {
      return;
    }

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
            toolbar: {
              show: true,
            },
          },
          series: [
            { name: "Usuarios Activos", data: chartsData.usuariosActivos },
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
            toolbar: {
              show: true,
            },
          },
          series: [{ name: "Ingresos", data: chartsData.ingresos }],
          xaxis: { categories: chartsData.categorias },
          colors: ["#007BFF"],
          title: { text: "Ingresos Totales", align: "center" },
        },
      },
    ];

    const renderedCharts = chartsConfig.map((config) => {
      const chart = new ApexCharts(
        document.querySelector(`#${config.id}`),
        config.options
      );
      chart.render();
      return chart;
    });

    return () => {
      renderedCharts.forEach((chart) => chart.destroy());
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
