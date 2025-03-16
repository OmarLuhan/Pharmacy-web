import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { authOneUser } from "../../services/auth";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  LockClosedIcon,
  EnvelopeIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";
import { TextInput } from "flowbite-react";

const PageLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTimeUTC = Math.floor(Date.now() / 1000);
        if (decodedToken.exp > currentTimeUTC) {
          if (decodedToken.role === "admin") {
            navigate("/dashboard");
          } else if (decodedToken.role === "user") {
            navigate("/ventas");
          }
        }
      } catch (error) {
        toast.warning("Token inválido. Inicie sesión nuevamente");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { status, token, tokenRefresh, msg } = await authOneUser(form);
      if (status !== 200) {
        toast.error(msg || "Credenciales incorrectas");
        return;
      }
      localStorage.setItem("token", token);
      localStorage.setItem("tokenRefresh", tokenRefresh);
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken?.role;
      if (userRole === "admin") {
        navigate("/dashboard");
      } else if (userRole === "user") {
        navigate("/ventas");
      } else {
        toast.warning("Rol desconocido. Contacte al administrador.");
      }
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0">
        <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-2xl">
          <div className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10">
            <img
              src="https://img.icons8.com/?size=100&id=JuUcYPInSV2Q&format=png&color=000000"
              className="mr-4 h-11"
              alt="iconos"
            />
            <span>CrisFarm</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Escribe tus credenciales
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Tu Email
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg">
                <EnvelopeIcon className="w-5 h-5 text-gray-500 mx-3" />
                <TextInput
                  type="email"
                  name="email"
                  id="email"
                  className="w-full"
                  placeholder="name@company.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Tu Contraseña
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg">
                <LockClosedIcon className="w-5 h-5 text-gray-500 mx-3" />
                <TextInput
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full"
                  required
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex items-start">
              <NavLink
                to="/recover"
                className="ml-auto text-sm text-primary-700 hover:underline text-blue-600"
              >
                Recuperar Contraseña?
              </NavLink>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-5 py-3 text-base font-medium text-center text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                                ${
                                  isLoading
                                    ? "bg-green-500 opacity-70 cursor-not-allowed animate-pulse"
                                    : "bg-green-400 hover:bg-green-600"
                                }`}
            >
              {isLoading ? (
                <>
                  <EllipsisHorizontalIcon className="w-5 h-5 text-white animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PageLogin;
