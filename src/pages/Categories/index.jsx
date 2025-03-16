import { useEffect, useState, useRef,useCallback } from "react";
import {
  deleteCategory,
  getCategories,
  createCategory,
  updateCategory,
  searchCategoriesByName,
} from "../../services/category";
import Table from "../../components/Table";
import { Button, TextInput } from "flowbite-react";
import ModalForm from "../../components/ModalForm";
import ModalDelete from "../../components/ModalDelete";
import { toast, Toaster } from "sonner";
import useModal from "../../hooks/useModal";
import usePagination from "../../hooks/usePagination";
import useForm from "../../hooks/useForm";
import debounce from 'lodash/debounce';

import {
  TrashIcon, PlusIcon,
  InformationCircleIcon, EllipsisVerticalIcon,
  CogIcon
} from '@heroicons/react/24/solid';


const columnProperties = [
  { name: "ID", property: "id" },
  { name: "Descripción", property: "descripcion" },
  { name: "Fecha registro", property: "fechaRegistro", type: "date" },
  { name: "Activo", property: "activo", type: "boolean" },
];

const CategoriesPage = () => {
  const {
    currentPage,
    totalPages,
    onPageChange,
    setTotalPages,
    resetPagination,
  } = usePagination();
  const [categories, setCategories] = useState([]);
  const [valueSearch, setValueSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, openModal, closeModal] = useModal({
    create: false,
    delete: false,
  });
  const { form, handleChange, setForm, resetForm } = useForm({
    descripcion: "",
  });
  const formRefs = useRef(null);

  const handleCloseModal = () => {
    resetForm();
    closeModal("create");
  };

  const fetchCategories = async (pageNumber = 1, pageSize = 10) => {
    try {
      const { status, data, totalPages: tp } = await getCategories(pageNumber, pageSize);
      switch (status) {
        case 200:
          setCategories(data);
          if (totalPages != tp) {
            resetPagination();
            setTotalPages(tp);
          }; break;
        default: toast.warning(`error no controlado code : ${status}`);
      }
    } catch (e) {
      toast.error(`${e}`);
    }
  };
  const debouncedSearch = useCallback(
    debounce(async (searchValue) => {
      if (searchValue.trim() === "") {
        await fetchCategories(currentPage);
        return;
      }

      if (searchValue.length > 2) {
        try {
          const { status, data, errorMessage } = await searchCategoriesByName(searchValue);
          if (status === 200) {
            setCategories(data);
            resetPagination();
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
    if (!form.descripcion.trim()) {
      toast.warning('La descripcion no debe estar vacía.');
      formRefs.current?.focus();
      return;
    }
    try{
      setIsLoading(true);
      const { status, errorMessage } = await createCategory(form);
    switch (status) {
      case 201:
        toast.success("Categoria creada correctamente.");
        fetchCategories(currentPage);
        handleCloseModal();
        break;
      case 409:
      case 400: toast.warning(errorMessage[0]); break;
      default: toast.warning(`Error no controlado code: ${status}`)
    }
    }catch(e){
      toast.error(`${e}`)
    }finally{
      setIsLoading(false);
    }
  };

  const handleModalEdit = (category) => {
    setIsEdit(true);
    setForm(category);
    openModal("create");
  };

  const handleEdit = async () => {
    try{
      setIsLoading(true);
      const {status,errorMessage}= await updateCategory(form);
    switch(status){
      case 204: 
        toast.success("El categoria actualizada correctamente.");
        fetchCategories(currentPage);
        handleCloseModal();
        break;
      case 404:
      case 400: toast.warning(errorMessage[0]);break;
      default: toast.warning(`Error no controlado code: ${status}`)
    }
    }catch(e){
      toast.error(`${e}`)
    }finally{
      setIsLoading(false);
    }
  };

  const handleModalDelete = (category) => {
    setForm(category);
    openModal("delete");
  };

  const handleDelete = async() => {
    try{
      const {status,errorMessage} = await deleteCategory(form.id);
    switch(status){
      case 204: 
      toast.success("Categoria eliminada correctamente");
      fetchCategories();break;
      case 404:
      case 409:
      case 400: toast.warning(errorMessage[0]);break;
      default : toast.warning(`error no controlado code: ${status}`)
    }
    }catch(e){
      toast.error(`${e}`);
    }finally{
      handleCloseModalDelete();
    }
  };

  const handleCloseModalDelete = () => {
    closeModal("delete");
    resetForm();
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  return (
    <main>
      <Toaster richColors position="top-right" />
      <div className="m-5 p-5 shadow-2xl rounded-lg ">
        <div className="w-full mb-1">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl ">
              Categorías
            </h1>
          </div>
          <div className="sm:flex">
            <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 ">
              <form className="lg:pr-3" onSubmit={e => e.preventDefault()}>
                <label htmlFor="categories-search" className="sr-only">
                  Buscar
                </label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="categories-search"
                    type="text"
                    name="category"
                    placeholder="Buscar categorías"
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
              <Button onClick={() => {
                  setIsEdit(false);
                  openModal("create");
                }}>
                <PlusIcon className="mr-2 h-5 w-5" /> Nueva categoría
              </Button>
            </div>
          </div>
        </div>

        <Table
          data={categories}
          columnProperties={columnProperties}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          fnEdit={handleModalEdit}
          fnDelete={handleModalDelete}
        />

        <ModalForm
          form={form}
          onChange={handleChange}
          show={showModal.create}
          onCloseModal={handleCloseModal}
          fnCreate={handleCreate}
          isEdit={isEdit}
          fnEdit={handleEdit}
          formRefs={formRefs}
          isLoading={isLoading}
        />

        <ModalDelete
          show={showModal.delete}
          message={`¿Desea eliminar la categoría ${form.descripcion}?`}
          fnDelete={handleDelete}
          fnCancel={handleCloseModalDelete}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
};

export default CategoriesPage;
