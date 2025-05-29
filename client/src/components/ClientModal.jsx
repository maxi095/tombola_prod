import ReactModal from "react-modal";
import { useForm } from "react-hook-form";
import { useClients } from "../context/ClientContext";

ReactModal.setAppElement("#root");

function ClientModal({ isOpen, onClose, onClientCreated }) {
  const { createClient, clientErrors } = useClients();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const clientData = {
      notes: data.notes || "",
      person: {
        firstName: data.firstName,
        lastName: data.lastName,
        document: data.document,
        address: data.address,
        city: data.city,
        phone: data.phone,
        email: data.email,
      },
    };

    try {
      const newClient = await createClient(clientData);
      onClientCreated(newClient);
      reset();
      onClose();
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  });

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => {
        reset();
        onClose();
      }}
      className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <div className="form-card">
          <h2 className="title">Nuevo Asociado</h2>

          {clientErrors &&
            clientErrors.map((err, i) => (
              <div key={i} className="form-error">
                {err}
              </div>
            ))}

          <form onSubmit={onSubmit} className="form-grid">
            <div className="form-section">
              <label className="label">Nombre</label>
              <input
                {...register("firstName", { required: "El nombre es requerido" })}
                className="form-input"
                placeholder="Nombre"
              />
              {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
            </div>

            <div className="form-section">
              <label className="label">Apellido</label>
              <input
                {...register("lastName", { required: "El apellido es requerido" })}
                className="form-input"
                placeholder="Apellido"
              />
              {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}
            </div>

            <div className="form-section">
              <label className="label">N° Documento</label>
              <input
                {...register("document", { required: "El N° documento es requerido" })}
                className="form-input"
                placeholder="N° documento"
              />
              {errors.document && <p className="form-error">{errors.document.message}</p>}
            </div>

            <div className="form-section">
              <label className="label">Email</label>
              <input
                type="email"
                {...register("email")}
                className="form-input"
                placeholder="Correo electrónico"
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div className="form-section">
              <label className="label">Dirección</label>
              <input
                {...register("address")}
                className="form-input"
                placeholder="Dirección"
              />
            </div>

            <div className="form-section">
              <label className="label">Localidad</label>
              <input
                {...register("city")}
                className="form-input"
                placeholder="Localidad"
              />
            </div>

            <div className="form-section">
              <label className="label">Teléfono</label>
              <input
                {...register("phone")}
                className="form-input"
                placeholder="Teléfono"
              />
            </div>

            <div className="form-section col-span-2">
              <label className="label">Notas</label>
              <textarea
                {...register("notes")}
                className="form-input"
                placeholder="Notas internas"
              />
            </div>

            <div className="col-span-2 flex justify-end mt-4 space-x-2">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                onClick={() => {
                  reset();
                  onClose();
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}

export default ClientModal;
