const API_BASE_URL = "http://localhost:4000";
const token = localStorage.getItem("jwtToken");

document.addEventListener("DOMContentLoaded", function () {
  // Manejo de envío de formularios para los tres tipos de reportes
  document
    .getElementById("membership-report-form")
    ?.addEventListener("submit", function (e) {
      e.preventDefault();
      generateReport("membership");
    });

  document
    .getElementById("payment-report-form")
    ?.addEventListener("submit", function (e) {
      e.preventDefault();
      generateReport("payment");
    });

  document
    .getElementById("comments-report-form")
    ?.addEventListener("submit", function (e) {
      e.preventDefault();
      generateReport("comments");
    });

  // Función para generar reportes
  function generateReport(reportType, forExport = false) {
    console.log(`Generando reporte de ${reportType}...`);

    // Mostrar loading
    const resultsContainer = document.getElementById(
      `${reportType}-report-results`
    );
    if (resultsContainer) {
      resultsContainer.innerHTML =
        '<div class="loading">Cargando datos...</div>';
    }

    // Construir los parámetros de filtro según el formulario
    const filters = getFilters(reportType);

    // Realizar la llamada a la API correspondiente
    return fetchDataFromAPI(reportType, filters)
      .then((data) => {
        if (!forExport) {
          displayReport(data, reportType);
        }
        return data;
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
        if (resultsContainer) {
          resultsContainer.innerHTML = `<div class="error">Error al cargar los datos: ${error.message}</div>`;
        }
        return [];
      });
  }

  // Función para obtener los filtros del formulario
  function getFilters(reportType) {
    const filters = {};
    const form = document.getElementById(`${reportType}-report-form`);

    if (!form) return filters;

    // Filtros comunes a todos los reportes
    if (form.elements[`${reportType}-start-date`]) {
      filters.startDate = form.elements[`${reportType}-start-date`].value;
    }

    if (form.elements[`${reportType}-end-date`]) {
      filters.endDate = form.elements[`${reportType}-end-date`].value;
    }

    // Filtros específicos para cada reporte
    switch (reportType) {
      case "membership":
        filters.status = form.elements["membership-status"]?.value;
        filters.type = form.elements["membership-type"]?.value;
        break;

      case "payment":
        filters.method = form.elements["payment-method"]?.value;
        break;

      case "comments":
        // No necesita filtros adicionales
        break;
    }

    // Limpiar filtros vacíos
    Object.keys(filters).forEach((key) => {
      if (!filters[key] || filters[key] === "all") {
        delete filters[key];
      }
    });

    return filters;
  }

  // Función para hacer la llamada a la API
  async function fetchDataFromAPI(reportType, filters = {}) {
    let endpoint = "";
    let queryParams = "";

    // Construir la URL según el tipo de reporte
    switch (reportType) {
      case "membership":
        endpoint = "/reporte-membresias";
        queryParams = buildQueryParams({
          estado: filters.status,
          tipo: filters.type,
          fecha_inicio: filters.startDate,
          fecha_fin: filters.endDate,
        });
        break;

      case "payment":
        endpoint = "/reporte-pagos";
        queryParams = buildQueryParams({
          metodo: filters.method,
          fecha_inicio: filters.startDate,
          fecha_fin: filters.endDate,
        });
        break;

      case "comments":
        endpoint = "/reporte-comentarios";
        queryParams = buildQueryParams({
          fecha_inicio: filters.startDate,
          fecha_fin: filters.endDate,
        });
        break;

      default:
        throw new Error("Tipo de reporte no válido");
    }

    const url = `${API_BASE_URL}/api/reportes${endpoint}${queryParams}`;
    console.log(`Consultando API: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Normalizar los datos según el tipo de reporte
    switch (reportType) {
      case "membership":
        return data.membresias || data;
      case "payment":
        return data.pagos || data;
      case "comments":
        return data.reportes || data;
      default:
        return data;
    }
  }

  // Función auxiliar para construir parámetros de consulta
  function buildQueryParams(params) {
    const validParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== "")
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      );

    return validParams.length > 0 ? `?${validParams.join("&")}` : "";
  }

  // Función para mostrar los resultados del reporte
  function displayReport(data, reportType) {
    const resultsContainer = document.getElementById(
      `${reportType}-report-results`
    );
    if (!resultsContainer) return;

    const table = document.createElement("table");
    let thead, tbody;

    // Crear tabla según el tipo de reporte
    switch (reportType) {
      case "membership":
        thead = `
                    <thead>
                        <tr>
                            <th>ID Membresía</th>
                            <th>Nombre</th>
                            <th>Tipo Membresía</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Vencimiento</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                `;

        tbody = document.createElement("tbody");
        data.forEach((item) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                        <td>${item.id_membresia || item.id}</td>
                        <td>${item.nombre_completo || item.nombre}</td>
                        <td>${item.tipo}</td>
                        <td>${formatDate(item.fecha_inicio)}</td>
                        <td>${formatDate(item.fecha_fin)}</td>
                        <td>${item.estado}</td>
                    `;
          tbody.appendChild(row);
        });
        break;

      case "payment":
        thead = `
                    <thead>
                        <tr>
                            <th>ID Pago</th>
                            <th>ID Cliente</th>
                            <th>Nombre</th>
                            <th>Fecha</th>
                            <th>Monto</th>
                            <th>Método</th>
                        </tr>
                    </thead>
                `;

        tbody = document.createElement("tbody");
        data.forEach((item) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                        <td>${item.id_pago || item.id}</td>
                        <td>${item.id_cliente}</td>
                        <td>${item.nombre_completo || item.nombre}</td>
                        <td>${formatDate(item.fecha_pago)}</td>
                        <td>${formatCurrency(item.monto)}</td>
                        <td>${item.metodo_pago}</td>
                    `;
          tbody.appendChild(row);
        });
        break;

      case "comments":
        thead = `
                    <thead>
                        <tr>
                            <th>ID Reporte</th>
                            <th>Nombre</th>
                            <th>Comentario/Sugerencia</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                `;

        tbody = document.createElement("tbody");
        data.forEach((item) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                        <td>${item.id_reporte || item.id}</td>
                        <td>${item.nombre}</td>
                        <td class="comment-cell">${item.reporte}</td>
                        <td>${formatDate(item.fecha)}</td>
                    `;
          tbody.appendChild(row);
        });
        break;
    }

    // Construir la tabla completa
    table.innerHTML = thead;
    table.appendChild(tbody);

    // Mostrar mensaje si no hay datos
    if (data.length === 0) {
      const colspan = reportType === "comments" ? "4" : "6";
      tbody.innerHTML = `<tr><td colspan="${colspan}" style="text-align: center;">No se encontraron resultados</td></tr>`;
    }

    // Reemplazar el contenido del contenedor
    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(table);

    console.log(
      `Reporte de ${reportType} mostrado con ${data.length} registros.`
    );
  }

  // Función para formatear fechas
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Función para formatear montos de dinero
  function formatCurrency(amount) {
    if (!amount) return "$0.00";
    if (typeof amount === "string" && amount.startsWith("$")) return amount;
    return `$${parseFloat(amount).toFixed(2)}`;
  }
});
