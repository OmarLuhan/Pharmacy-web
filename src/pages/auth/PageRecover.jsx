import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import { recoverPassword } from "../../services/auth";
import { NavLink } from "react-router-dom";
import { Label, TextInput, Spinner } from "flowbite-react";
import {
  ArrowLeftCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import passwordImg from "../../assets/img/password.png";

const PageRecover = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning("Por favor, introduce tu correo electrónico");
      return;
    }

    setIsLoading(true);
    try {
      const { status, isSuccess, errorMessage } = await recoverPassword(email);

      if (status === 204 && isSuccess) {
        toast.success(
          "Correo de recuperación enviado. ¡Revisa tu bandeja de entrada!"
        );
      } else {
        toast.warning(
          errorMessage || "Error en la solicitud. Inténtalo de nuevo."
        );
      }
    } catch (error) {
      toast.error("Error en la solicitud. Inténtalo de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 ">
        <NavLink
          to="/"
          className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10"
        >
          <img
            src={passwordImg}
            className="mr-4 h-16"
            alt="Reset Password Icon"
          />
        </NavLink>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="w-full p-6 sm:p-8">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 ">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-base font-normal text-gray-500 ">
              ¡No te preocupes! Simplemente ingresa tu correo electrónico y te
              enviaremos un código para restablecer tu contraseña.
            </p>

            <div className="flex justify-center items-center mt-4">
              <NavLink
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-blue-500 rounded-lg hover:bg-cyan-600 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                <ArrowLeftCircleIcon className="w-6 h-6" />
                <span className="hidden sm:inline">Volver</span>
              </NavLink>
            </div>

            <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Tu email
                </Label>
                <TextInput
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <button
                type="submit"
                className="relative inline-flex items-center justify-center w-full p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 "
                disabled={isLoading}
              >
                <span className="flex relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white  rounded-md group-hover:bg-opacity-0">
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="size-6 mr-2" />
                      Restablecer contraseña
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageRecover;
