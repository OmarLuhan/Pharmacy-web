import { Sidebar as FBSidebar } from "flowbite-react";
import { ChartPieIcon, TableCellsIcon, ShoppingCartIcon, PresentationChartBarIcon, TruckIcon } from "@heroicons/react/24/solid";
import { NavLink } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
  // Función para obtener los datos del usuario desde el token
  const getUserData = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      return {
        role: decodedToken.role,
      };
    }
    return null;
  };

  const userData = getUserData();

  return (
    <FBSidebar className="fixed top-0 left-0 z-20 flex-col flex-shrink-0 hidden w-52 h-full pt-16 font-normal duration-75 lg:flex transition-width border-r border-slate-200">
      <FBSidebar.Items>
        <FBSidebar.ItemGroup>
          {/* Dashboard - Solo accesible para admin */}
          {userData?.role === 'admin' && (
            <NavLink
              to={"/dashboard"}
              className={({ isActive }) =>
                `hover:bg-slate-200 flex items-center p-2 ${isActive ? 'font-bold text-[#155E75]' : 'text-black'}`}
            >
              <ChartPieIcon className="h-6 w-6 mr-2" />
              Dashboard
            </NavLink>
          )}

          {/* Opciones para el admin */}
          {userData?.role === 'admin' && (
            <FBSidebar.Collapse icon={TableCellsIcon} label="Gestión">
              <div className="flex flex-col space-y-2 text-center">
                <NavLink
                  to={"/categories"}
                  className={({ isActive }) =>
                    `hover:bg-slate-200 p-2 ${isActive ? 'font-bold text-[#155E75]' : 'text-black'}`}
                >
                  Categorias
                </NavLink>
                <NavLink
                  to={"/products"}
                  className={({ isActive }) =>
                    `hover:bg-slate-200 p-2 ${isActive ? 'font-bold text-[#155E75]' : 'text-black'}`}
                >
                  Productos
                </NavLink>
                <NavLink
                  to={"/users"}
                  className={({ isActive }) =>
                    `hover:bg-slate-200 p-2 ${isActive ? 'font-bold text-[#155E75]' : 'text-black'}`}
                >
                  Usuarios
                </NavLink>
              </div>
            </FBSidebar.Collapse>
          )}

          {/* Módulo de Ventas - Accesible para ambos roles */}
          <FBSidebar.Collapse icon={ShoppingCartIcon} label="Ventas">
            <div className="flex flex-col space-y-2 text-center">
              <NavLink
                to={"/ventas"}
                className={({ isActive }) =>
                  `hover:bg-slate-200 p-2 ${isActive ? 'font-bold text-[#155E75]' : 'text-black'}`}
              >
                Ventas
              </NavLink>
              <NavLink
                to={"/sale-history"}
                className={({ isActive }) =>
                  `hover:bg-slate-200 p-2 ${isActive ? 'font-bold text-[#155E75]' : 'text-black'}`}
              >
                Historial
              </NavLink>
            </div>
          </FBSidebar.Collapse>

          {/* Entradas - Solo accesible para admin */}
          {userData?.role === 'admin' && (
            <FBSidebar.Collapse icon={TruckIcon} label="Entradas">
              <div className="flex flex-col space-y-2 text-center">
                <NavLink
                  to={"/entradas"}
                  className={({ isActive }) =>
                    `hover:bg-slate-200 p-2 ${isActive ? 'font-bold text-[#155E75]' : 'text-black'}`}
                >
                  Entradas
                </NavLink>
                <NavLink
                  to={"/received-history"}
                  className={({ isActive }) =>
                    `hover:bg-slate-200 p-2 ${isActive ? 'font-bold text-[#155E75]' : 'text-black'}`}
                >
                  Historial
                </NavLink>
              </div>
            </FBSidebar.Collapse>
          )}

          {/* Reportes - Solo accesible para admin */}
          {userData?.role === 'admin' && (
            <FBSidebar.Collapse icon={PresentationChartBarIcon} label="Mis Reportes">
              <div className="flex flex-col space-y-2 text-center">
                <NavLink
                  to={"/report-sales"}
                  className={({ isActive }) =>
                    `hover:bg-slate-200 p-2 ${isActive ? 'font-bold text-[#155E75]' : 'text-black'}`}
                >
                  Reporte Ventas
                </NavLink>
                <NavLink
                  to={"/report-entries"}
                  className={({ isActive }) =>
                    `hover:bg-slate-200 p-2 ${isActive ? 'font-bold text-[#155E75]' : 'text-black'}`}
                >
                  Reporte Entradas
                </NavLink>
              </div>
            </FBSidebar.Collapse>
          )}
        </FBSidebar.ItemGroup>
      </FBSidebar.Items>
    </FBSidebar>
  );
};

export default Sidebar;