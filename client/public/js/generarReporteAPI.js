const API_BASE_URL = "http://localhost:4000";

document.addEventListener("DOMContentLoaded", () => {
  const reporteForm = document.getElementById("reporteForm");

  reporteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    // Obtener valores del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const reporte = document.getElementById("reporte").value.trim();

    // Validación básica en el cliente
    if (!nombre || !reporte) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (reporte.length > 500) {
      alert("El reporte no puede exceder los 500 caracteres");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reporte/reportes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, reporte }),
      });

      // Manejar la respuesta del servidor
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al enviar el reporte");
      }

      // Mostrar mensaje de éxito y redirigir
      alert(data.message);
      window.location.href = "../HTML/index.html";
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  });
});
