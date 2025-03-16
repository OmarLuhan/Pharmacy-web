import { useState } from "react";

const useModal = (modals) => {
  const [showModal, setShowModal] = useState(modals);

  const openModal = (modalName) => {
    setShowModal({ ...showModal, [modalName]: true });
  };

  const closeModal = (modalName) => {
    setShowModal({ ...showModal, [modalName]: false });
  };

  const closeAllModals = () => {
    setShowModal({...showModal, 'batch': false});
  };

  return [showModal, openModal, closeModal, closeAllModals];
};

export default useModal;
