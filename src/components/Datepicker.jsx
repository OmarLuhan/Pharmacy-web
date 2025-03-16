import { Datepicker as FBDatepicker } from "flowbite-react";

const Datepicker = ({ name, value, onChange, ...props }) => {
  const handleChange = (newValue) => {
    onChange({ currentTarget: { name, value: newValue } });
  };

  return (
    <FBDatepicker
      className="mb-12"
      onChange={handleChange}
      value={value ? new Date(value) : new Date()}
      selected={value ? new Date(value) : null}
      {...props}
      language="es-ES"
    />
  );
};

export default Datepicker;
