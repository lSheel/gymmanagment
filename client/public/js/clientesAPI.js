document.addEventListener("DOMContentLoaded", function () {
  // Elementos del DOM
  const verClientesBtn = document.getElementById("verClientesBtn");
  const clientesContainer = document.getElementById("clientesContainer");
  const eliminarForm = document.getElementById("eliminarForm");
  const mensajeEliminacion = document.getElementById("mensajeEliminacion");

  // URL base de la API
  const API_BASE_URL = "http://localhost:4000";
  const token = localStorage.getItem("jwtToken");

  function showLoading(element) {
    element.innerHTML = '<div class="loading">Cargando...</div>';
  }

  function showError(element, message) {
    element.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  }

  async function loadClientes() {
    showLoading(clientesContainer);

    try {
      const response = await fetch(`${API_BASE_URL}/api/clientes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener clientes");
      }

      if (data.count === 0) {
        clientesContainer.innerHTML = "<p>No hay clientes registrados</p>";
        return;
      }

      clientesContainer.innerHTML = generateClientTable(data.clientes);
    } catch (error) {
      showError(clientesContainer, error.message);
      console.error("Error:", error);
    }
  }

  function generateClientTable(clientes) {
    return `
        <div class="table-responsive">
            <table class="client-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NOMBRE</th>
                        <th>CONTACTO</th>
                        <th>GÉNERO</th>
                        <th>NACIMIENTO</th>
                        <th>INSCRIPCIÓN</th>
                        <th>ESTADO</th>
                    </tr>
                </thead>
                <tbody>
                    ${clientes
                      .map(
                        (cliente) => `
                        <tr>
                            <td>${cliente.id_cliente}</td>
                            <td class="name-cell">
                                <strong>${cliente.nombre_completo}</strong>
                            </td>
                            <td>
                                ${cliente.telefono || "N/A"}<br>
                                <small>${cliente.correo || ""}</small>
                                ${
                                  cliente.direccion
                                    ? `<small>${cliente.direccion.substring(
                                        0,
                                        20
                                      )}${
                                        cliente.direccion.length > 20
                                          ? "..."
                                          : ""
                                      }</small>`
                                    : ""
                                }
                            </td>
                            <td>${cliente.genero || "N/A"}</td>
                            <td>${formatDate(cliente.fecha_nacimiento)}</td>
                            <td>${formatDate(cliente.fecha_inscripcion)}</td>
                            <td><span class="badge badge-active">${
                              cliente.estado || "N/A"
                            }</span></td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
        <div class="table-footer">
            <p>Total: ${clientes.length} clientes</p>
        </div>
    `;
  }

  async function eliminarCliente(idCliente) {
    if (!confirm(`¿Eliminar al cliente con ID ${idCliente}?`)) return;

    showLoading(mensajeEliminacion);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/clientes/eliminar-cliente`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id_cliente: idCliente }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al eliminar");
      }

      mensajeEliminacion.innerHTML = `
                <div class="success-message">
                    ${data.message}
                </div>
            `;

      eliminarForm.reset();
      loadClientes();
    } catch (error) {
      mensajeEliminacion.innerHTML = `
                <div class="error-message">
                    ${error.message}
                </div>
            `;
      console.error("Error:", error);
    }
  }

  verClientesBtn.addEventListener("click", loadClientes);

  eliminarForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const idCliente = document.getElementById("id_cliente").value.trim();
    if (idCliente) eliminarCliente(idCliente);
  });

  // Cargar clientes al iniciar
  loadClientes();
});
