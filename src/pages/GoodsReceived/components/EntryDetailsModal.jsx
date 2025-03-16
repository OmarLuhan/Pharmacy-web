import { Modal } from "flowbite-react";
import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { formatDate } from "../../../utils/utils";

const EntryDetailsModal = ({ entryDetails, showModal, closeModal }) => {
  return (
    <Modal show={showModal} onClose={closeModal} size="3xl">
      <Modal.Header>Detalles de la Entrada</Modal.Header>
      <Modal.Body>
        {entryDetails ? (
          <div className="space-y-4">
            {/* Información del Proveedor */}
            <div className="border p-4 rounded-lg shadow-sm bg-white">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Información del Proveedor
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <strong>Proveedor: </strong>
                    <span className="text-cyan-700 font-bold">
                      {entryDetails.proveedor}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Documento: </strong>
                    <span className="text-cyan-700 font-bold">
                      {entryDetails.documento}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Correlativo: </strong>
                    <span className="text-cyan-700 font-bold">
                      {entryDetails.correlativo}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Fecha Registro: </strong>
                    <br />
                    <span className="text-cyan-700 font-bold">
                      {entryDetails.fechaRegistro
                        ? formatDate(
                            new Date(entryDetails.fechaRegistro),
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
                      {entryDetails.estado ? (
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
                    <strong>Subtotal: </strong>
                    <span className="text-cyan-700 font-bold">
                      S/ {entryDetails.subTotal}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Impuesto Total: </strong>
                    <span className="text-cyan-700 font-bold">
                      S/ {entryDetails.impuestoTotal}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Total: </strong>
                    <span className="text-cyan-700 font-bold">
                      S/ {entryDetails.total}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Detalles de la Entrada */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Productos en la Entrada
              </h3>
              <table className="w-full text-left table-auto mt-2">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="px-4 py-2">Producto</th>
                    <th className="px-4 py-2">Código</th>
                    <th className="px-4 py-2">Lote</th>
                    <th className="px-4 py-2">Cantidad</th>
                    <th className="px-4 py-2">Precio Unitario</th>
                    <th className="px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {entryDetails.detalleEntrada.map((detalle, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">
                        {detalle.nombreProducto.toUpperCase()}
                      </td>
                      <td className="px-4 py-2">{detalle.codigoProducto}</td>
                      <td className="px-4 py-2">{detalle.loteNumero}</td>
                      <td className="px-4 py-2">{detalle.cantidad}</td>
                      <td className="px-4 py-2 font-semibold">
                        S/ {detalle.precio}
                      </td>
                      <td className="px-4 py-2 font-semibold">
                        S/ {detalle.total}
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

export default EntryDetailsModal;
