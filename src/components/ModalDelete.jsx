import { Button, Modal,Spinner } from "flowbite-react";

import {
  InformationCircleIcon
} from '@heroicons/react/24/solid';


const ModalDelete = ({
  show,
  message,
  textDelete = "Eliminar",
  textCancel = "Cancelar",
  fnDelete,
  fnCancel,
  isLoading
}) => {
  return (
    <Modal show={show} size="md" onClose={fnCancel} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <InformationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 " />
          <h3 className="mb-5 text-lg font-normal text-gray-500 ">
            {message}
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={fnDelete} disabled={isLoading}>
              {isLoading ? (<Spinner/>) :textDelete}
            </Button>
            <Button color="gray" onClick={fnCancel}>
              {textCancel}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalDelete;
