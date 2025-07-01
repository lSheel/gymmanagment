document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const welcomeModal = document.getElementById("welcomeModal");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const closeModalBtn = document.getElementById("closeModal");

  // Manejar el cierre del modal (ventana de bienvenida)
  closeModalBtn.addEventListener("click", () => {
    welcomeModal.style.display = "none";
  });

  // Cerrar modal al hacer clic fuera del contenido
  welcomeModal.addEventListener("click", (e) => {
    if (e.target === welcomeModal) {
      welcomeModal.style.display = "none";
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre_completo = document
      .getElementById("nombre_completo")
      .value.trim();

    try {
      const response = await fetch(
        "http://localhost:4000/api/acceso-gym/verificar-acceso",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre_completo }),
        }
      );

      const data = await response.json();

      if (data.error) {
        // Mostrar error en el modal
        welcomeMessage.textContent = data.message;
        welcomeMessage.style.color = "#e74c3c";
        document.getElementById("welcomeTitle").textContent = "Error";
        welcomeModal.style.display = "flex";
      } else {
        // Mostrar mensaje de bienvenida
        welcomeMessage.textContent = data.message;
        welcomeMessage.style.color = "#2ecc71";
        document.getElementById("welcomeTitle").textContent = "¡Bienvenido!";
        welcomeModal.style.display = "flex";
      }
    } catch (error) {
      console.error("Error:", error);
      welcomeMessage.textContent =
        "Error al verificar el acceso. Intenta nuevamente.";
      welcomeMessage.style.color = "#e74c3c";
      document.getElementById("welcomeTitle").textContent = "Error";
      welcomeModal.style.display = "flex";
    }
  });
});
