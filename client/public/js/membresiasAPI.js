const API_BASE_URL = "http://localhost:4000";
const token = localStorage.getItem("jwtToken");

document.addEventListener("DOMContentLoaded", () => {
  // Formulario para asignar membresía
  const formAsignar = document.getElementById("formAsignarMembresia");
  if (formAsignar) {
    formAsignar.addEventListener("submit", asignarMembresia);
  }

  // Formulario para cancelar membresía
  const formCancelar = document.getElementById("formCancelarMembresia");
  if (formCancelar) {
    formCancelar.addEventListener("submit", cancelarMembresia);
  }
});

// Función para asignar membresía
async function asignarMembresia(event) {
  event.preventDefault();

  const id_cliente = document.getElementById("id_cliente").value;
  const tipo_membresia = document.getElementById("tipo_membresia").value;

  try {
    const response = await fetch(`${API_BASE_URL}/api/membresias/asignar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_cliente, tipo_membresia }),
    });

    const data = await response.json();

    if (data.success) {
      alert(data.message);
      window.location.href = "membresias.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al conectar con el servidor");
  }
}

// Función para cancelar membresía
async function cancelarMembresia(event) {
  event.preventDefault();

  const id_membresia = document.getElementById("id_membresia").value;

  try {
    const response = await fetch(`${API_BASE_URL}/api/membresias/cancelar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_membresia }),
    });

    const data = await response.json();

    if (data.success) {
      alert(data.message);
      window.location.href = "membresias.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al conectar con el servidor");
  }
}
