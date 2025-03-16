import { Avatar, Dropdown, Navbar as FBNavbar } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ProfilePicture from "../assets/img/icons-user.png";
import { getProfile } from "../services/profile";
import { useEffect, useState } from "react";
import { UserCircleIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [image, setImage] = useState(ProfilePicture);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenRefresh");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  // Función para obtener los datos del usuario desde el token
  const getUserData = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return {
        name: decodedToken.unique_name,
        email: decodedToken.email,
        role: decodedToken.role,
        sub: decodedToken.sub,
      };
    }
    return null;
  };

  const userData = getUserData();

  const infoProfile = async () => {
    const { data } = await getProfile(userData.sub);
    setNombre(data.nombre);
    setCorreo(data.correo);
    setImage(data.urlFoto || ProfilePicture);
  };

  useEffect(() => {
    infoProfile();
  }, []);

  return (
    <FBNavbar
      fluid
      rounded
      className="fixed z-30 w-full border-b border-gray-200 shadow-md"
    >
      <FBNavbar.Brand>
        <span className="self-center whitespace-nowrap text-2xl font-bold">
          CrisFarma
        </span>
      </FBNavbar.Brand>
      <div className="flex items-center gap-4 md:order-2">
        {/* Dropdown para perfil */}
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img={image} // Imagen personalizada o predeterminada
              rounded
            />
          }
        >
          <Dropdown.Header>
            <div className="text-center">
              <span className="block text-sm font-semibold text-gray-700 ">
                {nombre}
              </span>
              <span className="block truncate text-sm font-medium text-gray-500 ">
                {correo}
              </span>
            </div>
          </Dropdown.Header>

          <Dropdown.Divider />
          <Dropdown.Item
            className="flex items-center gap-2 text-cyan-700 font-semibold hover:bg-cyan-100 "
            onClick={handleProfile}
          >
            <UserCircleIcon className="w-5 h-5" />
            Ver Perfil
          </Dropdown.Item>
          <Dropdown.Item
            className="flex items-center gap-2 text-rose-600 font-semibold hover:bg-rose-100 "
            onClick={handleLogout}
          >
            <ArrowRightIcon className="w-5 h-5" />
            Salir
          </Dropdown.Item>
        </Dropdown>

        {/* Botón para colapsar el menú en móviles */}
        <FBNavbar.Toggle />
      </div>
    </FBNavbar>
  );
};

export default Navbar;
