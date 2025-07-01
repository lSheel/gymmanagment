document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    // Si no hay token, redirigir al login
    window.location.href = "index.html";
    return;
  }
  console.log("Middleware de autenticación ejecutándose");
  console.log("Token encontrado:", !!token);
  // Verificar token con el servidor
  verifyToken(token).catch(() => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userData");
    window.location.href = "index.html";
  });
});

async function verifyToken(token) {
  try {
    const response = await fetch(`http://localhost:4000/api/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token inválido");
    }
  } catch (error) {
    throw error;
  }
}
