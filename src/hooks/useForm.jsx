import { useState } from "react";

const useForm = (initialValues) => {
  const [form, setForm] = useState(initialValues);

  const handleChange = (evt) => {
    const { name, value } = evt.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (evt) => {
    const { name, checked } = evt.currentTarget;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const resetForm = () => {
    setForm(initialValues);
  };

  const clearField = (name) => {
    setForm((prev) => ({ ...prev, [name]: "" }));
  };

  return {
    form,
    handleChange,
    handleCheckChange,
    setForm,
    resetForm,
    clearField,
  };
};

export default useForm;
