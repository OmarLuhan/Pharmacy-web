import { useEffect, useState ,useRef,useCallback} from "react";
import { Button, TextInput } from "flowbite-react";
import {
  deleteUser,
  getUsers,
  createUser,
  updateUser,
  searchUsersByName,
} from "../../services/user";
import { toast, Toaster } from "sonner";
import useForm from "../../hooks/useForm";
import useModal from "../../hooks/useModal";
import Table from "../../components/Table";
import ModalDelete from "../../components/ModalDelete";
import ModalUserForm from "./components/ModalUserForm";
import debounce from 'lodash/debounce';

import {
  TrashIcon, PlusIcon,
  InformationCircleIcon, EllipsisVerticalIcon,
  CogIcon
} from '@heroicons/react/24/solid';

const columnProperties = [
  {
    name: "Nombre",
    type: "user",
    property: { fullName: "nombre", email: "correo", photo: "urlFoto" },
  },
  { name: "Rol", property: "rolNombre" },
  { name: "Estado", property: "activo", type: "boolean" },
];

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [valueSearch, setValueSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, openModal, closeModal] = useModal({
    create: false,
    delete: false,
    batch: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { form, handleChange, handleCheckChange, setForm, resetForm } = useForm(
    {
      nombre: "",
      correo: "",
      rolId: 1,
    }
  );
  const formRefs = useRef(Array(2).fill(null));

  const handleCloseModal = () => {
    resetForm();
    closeModal("create");
  };

  const fetchUsers = async () => {
    try {
      const { status, data, errorMessage } = await getUsers();
      switch(status){
        case 200: setUsers(data);break;
        default: toast.warning(`Error no controlado: ${errorMessage}`);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  const debouncedSearch = useCallback(
      debounce(async (searchValue) => {
        if (searchValue.trim() === "") {
          await fetchUsers();
          return;
        }
  
        if (searchValue.length > 2) {
          try {
            const { status, data, errorMessage } = await searchUsersByName(searchValue);
            if (status === 200) {
              setUsers(data);
            } else {
              toast.warning(`Error no controlado: ${errorMessage[0]}`);
            }
          } catch (error) {
            toast.error(`${error}`);
          }
        }
      }, 500),  
      []  
    );
    const handleInputChange = (e) => {
      e.preventDefault();
      const value = e.currentTarget.value;
      setValueSearch(value);
      debouncedSearch(value); 
    };
  const handleCreate = async () => {
    const { nombre, correo, rolId } = form;

    if (nombre.length < 5) {
      toast.warning('El nombre tiene que tener un minimo de 5 caracteres');
      formRefs.current[0].focus();
      return;
    }

    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      toast.warning('Por favor, ingresa un correo válido');
      formRefs.current[1].focus();
      return;
    }

    if (!rolId || isNaN(rolId)) {
      toast.warning('Por favor, selecciona un rol válido');
      return;
    }

    setIsLoading(true);
   try{
    const {status,errorMessage}= await createUser(form)
      switch(status){
        case 201: 
        fetchUsers();
        handleCloseModal();
        toast.success("El usuario se ha creado correctamente");break;
        case 409: 
        case 400: toast.warning(errorMessage[0]);break;
        default : toast.error("error no controlado");
      }
   }catch(error){
    toast.error(`${error}`);
   }finally{
    setIsLoading(false);
   }
  };

  const handleModalEdit = (user) => {
    setIsEdit(true);
    setForm(user);
    openModal("create");
  };

  const handleEdit = async () => {
    const { nombre, correo} = form;
    if (nombre.length < 5) {
      toast.warning('El nombre tiene que tener un minimo de 5 caracteres');
      formRefs.current[0].focus();
      return;
    }

    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      toast.warning('Por favor, ingresa un correo válido');
      formRefs.current[1].focus();
      return;
    }
    setIsLoading(true);
  try{
    const {status,errorMessage} = await  updateUser(form);
    switch(status){
     case 204: 
       fetchUsers();
       handleCloseModal();
       toast.success("El usuario se ha actualizado correctamente.");
       break;
 
     case 400:
     case 404: 
     case 406:toast.warning(errorMessage[0]);break;
     default: toast.warning(`erro no controlado dode: ${status}`)
    }
  }catch(error){
    toast.error(`${error}`);
  }finally{
    setIsLoading(false);
  }
  };

  const handleModalDelete = (User) => {
    setForm(User);
    openModal("delete");
  };
  const handleCloseModalDelete = () => { 
    closeModal("delete");
    resetForm();
  };
  const handleDelete = async () => {
    try{
      const {status,errorMessage}= await deleteUser(form.id);
      switch(status){
        case 204: 
        toast.success("El usuario se ha eliminado correctamente");
        fetchUsers();break;
        case 404:
        case 409:
        case 400: toast.warning(errorMessage[0]);break;
        default : toast.warning(`error no controlado code: ${status}`)
      }
    }catch(error){
      toast.error(`${error}`);
    }finally{
      handleCloseModalDelete();
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="m-5 p-5 shadow-2xl rounded-lg ">
        <div className="w-full mb-1">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl ">
              Usuarios
            </h1>
          </div>
          <div className="sm:flex">
            <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0">
              <form className="lg:pr-3" onSubmit={e=>e.preventDefault()}>
                <label htmlFor="users-search" className="sr-only">
                  Buscar
                </label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="users-search"
                    type="text"
                    name="user"
                    placeholder="Buscar usuarios"
                    value={valueSearch}
                    onChange={handleInputChange}
                    onInput={handleInputChange}
                  />
                </div>
              </form>
              <div>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                >
                  <CogIcon className="size-6" />
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                >
                  <TrashIcon className="size-6" />
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                >
                  <InformationCircleIcon className="size-6" />
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                >
                  <EllipsisVerticalIcon className="size-6" />
                </a>
              </div>
            </div>
            <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
              <Button
                onClick={() => {
                  setIsEdit(false);
                  openModal("create");
                }}
              >
                <PlusIcon className="mr-2 h-5 w-5" /> Nuevo usuario
              </Button>
            </div>
          </div>
        </div>
        <Table
          data={users}
          columnProperties={columnProperties}
          fnEdit={handleModalEdit}
          fnDelete={handleModalDelete}
          pagination={false}
        />

        <ModalUserForm
          form={form}
          onChange={handleChange}
          onCheckChange={handleCheckChange}
          show={showModal.create}
          onCloseModal={handleCloseModal}
          isEdit={isEdit}
          fnCreate={handleCreate}
          fnEdit={handleEdit}
          isLoading={isLoading}
          formRefs={formRefs}
        />

        <ModalDelete
          show={showModal.delete}
          message={`¿Desea eliminar el usuario ${form.nombre}?`}
          fnDelete={handleDelete}
          fnCancel={handleCloseModalDelete}
        />
      </div>
    </>
  );
};

export default UsersPage;
