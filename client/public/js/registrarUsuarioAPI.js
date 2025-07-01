const API_BASE_URL = "http://localhost:4000";
const token = localStorage.getItem("jwtToken");

document.addEventListener("DOMContentLoaded", () => {
  const registroForm = document.getElementById("registroClienteForm");

  registroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const formData = {
      nombre_completo: document.getElementById("nombre_completo").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      direccion: document.getElementById("direccion").value.trim(),
      genero: document.getElementById("genero").value,
      fecha_nacimiento: document.getElementById("fecha_nacimiento").value,
      correo: document.getElementById("correo").value.trim(),
    };

    // Validación básica en el cliente
    if (!formData.nombre_completo || !formData.genero) {
      alert("Nombre completo y género son campos requeridos");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/registrarCliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar el cliente");
      }

      alert(data.message);
      registroForm.reset();
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  });
});
