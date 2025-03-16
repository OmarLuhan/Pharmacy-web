import { Modal } from "flowbite-react";
import { formatDate } from "../../../utils/utils";

import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/solid";

const SaleDetailsModal = ({ ventaDetails, showModal, closeModal }) => {
  return (
    <Modal show={showModal} onClose={closeModal} size="3xl">
      <Modal.Header>Detalles de la Venta</Modal.Header>
      <Modal.Body>
        {ventaDetails ? (
          <div className="space-y-4">
            <div className="border p-4 rounded-lg shadow-sm bg-white">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Información del Cliente
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <strong>DNI Cliente: </strong>
                    <span className="text-cyan-700 font-bold">
                      {ventaDetails.clienteDni}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Nombre: </strong>
                    <span className="text-cyan-700 font-bold">
                      {ventaDetails.clienteNombre}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Correlativo: </strong>
                    <span className="text-cyan-700 font-bold">
                      {ventaDetails.correlativo}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Fecha Registro: </strong>
                    <br />
                    <span className="text-cyan-700 font-bold">
                      {ventaDetails.fechaRegistro
                        ? formatDate(
                            new Date(ventaDetails.fechaRegistro),
                            "DD-MM-YYYY HH:mm:ss"
                          )
                        : "Fecha no disponible"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Estado: </strong>
                    <span>
                      {ventaDetails.estado === "True" ? (
                        <CheckBadgeIcon className="size-6 text-blue-500" />
                      ) : (
                        <XMarkIcon className="size-6 text-red-500" />
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Información del Pago */}
            <div className="border p-4 rounded-lg shadow-sm bg-white">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Información del Pago
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <strong>Usuario: </strong>
                    <span className="text-green-400 font-bold">
                      {ventaDetails.usuarioNombre}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Subtotal: </strong>
                    <span className="text-cyan-700 font-bold">
                      S/ {ventaDetails.subTotal}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Impuesto Total: </strong>
                    <span className="text-cyan-700 font-bold">
                      S/ {ventaDetails.impuestoTotal}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Total: </strong>
                    <span className="text-cyan-700 font-bold">
                      S/ {ventaDetails.total}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Detalles de la venta */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Productos en la Venta
              </h3>
              <table className="w-full text-left table-auto mt-2">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="px-4 py-2">Producto</th>
                    <th className="px-4 py-2">Cantidad</th>
                    <th className="px-4 py-2">Precio </th>
                  </tr>
                </thead>
                <tbody>
                  {ventaDetails.detalleVenta.map((detalle, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">
                        {detalle.nombreProducto.toUpperCase()}
                      </td>
                      <td className="px-4 py-2">{detalle.cantidad}</td>
                      <td className="px-4 py-2 font-semibold">
                        S/ {detalle.precio}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No hay detalles disponibles.
          </p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SaleDetailsModal;
