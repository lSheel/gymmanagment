const API_BASE_URL = "http://localhost:4000";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el login");
      }

      // Guardar token y datos de usuario en localStorage
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));

      // Redirigir al menú principal
      window.location.href = "menu.html";
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  });
});
