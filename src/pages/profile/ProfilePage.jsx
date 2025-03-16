import { useState, useRef, useEffect } from "react";
import {
  updateProfile,
  updateUploadFile,
  updatePassword,
  deleteFile,
  getProfile,
} from "../../services/profile";
import { toast, Toaster } from "sonner";
import {
  CloudArrowUpIcon,
  TrashIcon,
  Cog8ToothIcon,
  ClockIcon,
  TrophyIcon,
} from "@heroicons/react/24/solid";
import { Button, TextInput } from "flowbite-react";

import ProfilePicture from "../../assets/img/icons-user.png";

const ProfilePage = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(ProfilePicture);
  const [loading, setLoading] = useState(false);
  const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);
  const [loadingUpdatePassword, setLoadingUpdatePassword] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setLoading(true);
    try {
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      const { status } = await updateUploadFile(formData);
      switch (status) {
        case 204:
          setProfileImage(URL.createObjectURL(file));
          toast.success("Foto de perfil actualizada");
          break;
        default:
          toast.warning(`error al subir la foto de perfil: ${status}`);
      }
    } catch (error) {
      toast.error("Error al subir la foto de perfil");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteImage = async () => {
    setLoading(true);
    try {
      const { status } = await deleteFile();
      switch (status) {
        case 204:
          toast.success("Foto de perfil eliminada");
          setProfileImage(ProfilePicture);
          break;
        default:
          toast.warning(`Error al eliminar la foto de perfil: ${status}`);
          break;
      }
    } catch (error) {
      toast.error("Error al eliminar la foto de perfil");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateProfile = async () => {
    setLoadingUpdateProfile(true);
    const data = {
      id: "",
      nombre,
      correo,
    };
    const { status } = await updateProfile(data);
    try {
      switch (status) {
        case 204:
          toast.success("Perfil actualizado");
          break;
        default:
          toast.warning(`Error al actualizar el perfil: ${status}`);
          break;
      }
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    } finally {
      setLoadingUpdateProfile(false);
    }
  };
  const handleUpdatePassword = async () => {
    const passwordLength = 6;
    if (newPassword !== confirmPassword) {
      toast.warning("Las contraseñas no coinciden");
      return;
    }
    if (newPassword.length < passwordLength) {
      toast.warning(
        `La nueva contraseña debe tener al menos ${passwordLength} caracteres.`
      );
      return;
    }
    setLoadingUpdatePassword(true);
    const data = {
      id: "",
      currentPassword,
      newPassword,
    };
    try {
      const { status } = await updatePassword({ id, data });
      switch (status) {
        case 204:
          toast.success("Contraseña actualizada con éxito");
          break;
        default:
          toast.warning(`Error al actualizar la contraseña: ${status}`);
          break;
      }
    } catch (error) {
      toast.error("Error al actualizar la contraseña");
    } finally {
      setLoadingUpdatePassword(false);
    }
  };

  const infoProfile = async () => {
    const { data } = await getProfile();
    setNombre(data.nombre);
    setCorreo(data.correo);
    setProfileImage(data.urlFoto || ProfilePicture);
  };
  useEffect(() => {
    infoProfile();
  }, []);

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
        <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4 m-4">
          <img
            className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0"
            src={profileImage}
            alt="Foto del usuario"
          />
          <div>
            <h3 className="mb-1 text-xl font-bold text-gray-900 e">
              Foto de perfil
            </h3>
            <div className="mb-4 text-sm text-gray-500 ">
              JPG, GIF o PNG. Tamaño máximo de 800K
            </div>
            <div className="flex items-center space-x-32">
              <Button
                type="button"
                onClick={handleFileUpload}
                disabled={loading}
              >
                {loading ? (
                  <div className="relative flex items-center">
                    <ClockIcon className="size-6 animate-spin text-cyan-00" />
                    ...
                  </div>
                ) : (
                  <>
                    <CloudArrowUpIcon className="size-6" />
                    Subir foto
                  </>
                )}
              </Button>
              <TextInput
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="inline-flex items-center mx-20 px-6 py-3 text-sm font-medium text-center rounded-lg border border-gray-300 hover:text-cyan-700 hover:bg-gray-200 focus:ring-4"
                disabled={loading}
              >
                <TrashIcon className="h-5 text-red-500" />
                Eliminar Foto
              </button>
            </div>
          </div>
        </div>

        {/* Sección de información general */}
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
          <h3 className="mb-4 text-xl font-semibold">Información general</h3>
          <form action="#">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                  Nombre
                </label>
                <TextInput
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Email
                </label>
                <TextInput
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className="col-span-6 sm:col-full">
                <Button
                  type="button"
                  onClick={handleUpdateProfile}
                  disabled={loadingUpdateProfile}
                >
                  {loadingUpdateProfile ? (
                    <div className="flex items-center">
                      <Cog8ToothIcon className="w-5 h-5 mr-2 animate-spin" />
                      Actualizando...
                    </div>
                  ) : (
                    "Actualizar Usuario"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Sección de cambio de contraseña */}
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
          <h3 className="mb-4 text-xl font-semibold">Actualizar Contraseña</h3>
          <form action="#">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Contraseña Actual
                </label>
                <TextInput
                  type="password"
                  name="current-password"
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Nueva Contraseña
                </label>
                <TextInput
                  type="password"
                  name="new-password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Confirmar Contraseña
                </label>
                <TextInput
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="col-span-6 sm:col-full">
                <Button
                  type="button"
                  onClick={handleUpdatePassword}
                  disabled={loadingUpdatePassword}
                >
                  {loadingUpdatePassword ? (
                    <div className="flex items-center">
                      <Cog8ToothIcon className="w-5 h-5 mr-2 animate-spin" />
                      Cambiando...
                    </div>
                  ) : (
                    "Actualizar Contraseña"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
