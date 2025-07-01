const API_BASE_URL = "http://localhost:4000";
const token = localStorage.getItem("jwtToken");

document.addEventListener("DOMContentLoaded", () => {
  // Registrar nuevo pago
  const registroForm = document.getElementById("registroPagoForm");
  if (registroForm) {
    registroForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Obtener la fecha actual del sistema
      const fechaActual = new Date();
      // Formatear como YYYY-MM-DD (formato compatible con MySQL)
      const fechaFormateada = fechaActual.toISOString().split("T")[0];

      // Establecer la fecha automática en el campo oculto
      document.getElementById("fecha_pago").value = fechaFormateada;

      const formData = {
        id_cliente: document.getElementById("id_cliente").value,
        monto: parseFloat(document.getElementById("monto").value),
        fecha_pago: fechaFormateada, // Usamos la fecha generada
        metodo_pago: document.getElementById("metodo_pago").value,
      };

      try {
        const response = await fetch(`${API_BASE_URL}/api/pagos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al registrar el pago");
        }

        alert(data.message);
        registroForm.reset();
      } catch (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
      }
    });
  }

  // Consultar pagos
  const consultaForm = document.getElementById("consultaPagosForm");
  if (consultaForm) {
    consultaForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const busqueda = document.getElementById("busqueda_cliente").value.trim();

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/pagos?busqueda=${encodeURIComponent(busqueda)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al consultar pagos");
        }

        mostrarResultadosPagos(data.pagos);
      } catch (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
      }
    });
  }

  // Anular pago
  const anulacionForm = document.getElementById("anulacionPagoForm");
  if (anulacionForm) {
    anulacionForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id_pago = document.getElementById("id_pago").value.trim();

      if (!confirm("¿Estás seguro de que deseas anular este pago?")) {
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/pagos/anular/${id_pago}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al anular el pago");
        }

        alert(data.message);
        anulacionForm.reset();
      } catch (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
      }
    });
  }

  // Función para mostrar resultados de pagos
  function mostrarResultadosPagos(pagos) {
    const resultadosDiv =
      document.getElementById("resultadosPagos") ||
      document.createElement("div");
    resultadosDiv.id = "resultadosPagos";
    resultadosDiv.innerHTML = "";

    if (!pagos || pagos.length === 0) {
      resultadosDiv.innerHTML = "<p>No se encontraron pagos</p>";
      return;
    }

    const tabla = document.createElement("table");
    tabla.className = "resultados-table";

    // Crear encabezados
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    [
      "ID Pago",
      "Cliente",
      "Nombre",
      "Monto",
      "Fecha",
      "Método",
      "Anulado",
    ].forEach((texto) => {
      const th = document.createElement("th");
      th.textContent = texto;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    tabla.appendChild(thead);

    // Crear cuerpo
    const tbody = document.createElement("tbody");
    pagos.forEach((pago) => {
      const row = document.createElement("tr");

      [
        pago.id_pago,
        pago.id_cliente,
        pago.nombre_completo,
        `$${pago.monto.toFixed(2)}`,
        new Date(pago.fecha_pago).toLocaleDateString(),
        pago.metodo_pago,
        pago.anulado ? "Sí" : "No",
      ].forEach((texto) => {
        const td = document.createElement("td");
        td.textContent = texto;
        row.appendChild(td);
      });

      tbody.appendChild(row);
    });
    tabla.appendChild(tbody);

    resultadosDiv.appendChild(tabla);

    // Insertar resultados en el DOM si no existe
    if (!document.getElementById("resultadosPagos")) {
      consultaForm.insertAdjacentElement("afterend", resultadosDiv);
    }
  }
});
