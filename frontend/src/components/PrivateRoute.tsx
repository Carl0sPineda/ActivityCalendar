import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import backgroundImage from "../assets/screen.avif";

const schemaPassword = z.object({
  password: z
    .string()
    .min(1, "Este campo es requerido")
    .trim()
    .max(20, "Debe ser menos a 20 caracteres")
    .regex(/^[^<>&]*$/, "Scripts o caracteres especiales no son permitidos"),
});

interface Password {
  password: string;
}

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Password>({
    resolver: zodResolver(schemaPassword),
  });

  const handleLogin = (data: { password: string }) => {
    if (data.password === import.meta.env.VITE_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Ingreso con éxito!");
    } else {
      toast.error("Código incorrecto!");
    }
  };

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="py-52 px-1 md:px-8 text-center relative text-white font-bold text-2xl md:text-3xl overflow-auto min-h-dvh"
    >
      <h1 className="pb-4">Ingresa el código</h1>
      <div className="w-11/12 md:w-3/4 lg:max-w-3xl m-auto">
        <div className="relative z-30 text-base text-black">
          <form onSubmit={handleSubmit(handleLogin)}>
            <input
              autoFocus
              type="password"
              placeholder="código"
              className={`mt-2 shadow-md focus:outline-none rounded-2xl py-3 px-6 block w-full ${
                errors.password ? "border-red-200" : ""
              }`}
              {...register("password")}
            />
            {errors.password && (
              <span className="text-red-200 block">
                {errors.password.message}
              </span>
            )}
            <button className="bg-black hover:bg-slate-950 ease-in-out duration-200 px-4 py-2 mt-2 ml-2 text-gray-200 rounded-lg">
              Ingresar
            </button>
          </form>
          <div className="text-left absolute top-10 rounded-t-none rounded-b-2xl shadow bg-white divide-y w-full max-h-40 overflow-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default PrivateRoute;
