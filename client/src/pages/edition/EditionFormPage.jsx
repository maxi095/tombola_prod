import { useForm, useFieldArray  } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditions } from "../../context/EditionContext";
import { useAuth } from "../../context/AuthContext";


function EditionFormPage() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "installments",
  });

  const { createEdition, getEdition, updateEdition } = useEditions();
  const { errors: editionErrors } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const loadEdition = async () => {
      if (params.id) {
        try {
          const edition = await getEdition(params.id);
          if (edition) {
            setValue("name", edition.name);
            setValue("quantityCartons", edition.quantityCartons);
            setValue("cost", edition.cost);
            setValue("maxQuotas", edition.maxQuotas);
            setValue("installments", edition.installments || []);
          }
        } catch (error) {
          console.error("Error loading edition:", error);
        }
      }
    };

    loadEdition();
  }, [params.id, getEdition, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Validación: cantidad de cuotas vs maxQuotas
      const totalInstallments = data.installments?.length || 0;
      const expectedQuotas = parseInt(data.maxQuotas, 10);
  
      if (totalInstallments !== expectedQuotas) {
        alert(`La cantidad de cuotas ingresadas (${totalInstallments}) no coincide con el plan de cuotas (${expectedQuotas}).`);
        return;
      }
  
      // Validación: suma de montos vs costo
      const totalAmount = data.installments.reduce((sum, installment) => {
        const amount = parseFloat(installment.amount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
  
      const expectedCost = parseFloat(data.cost);
      const roundedTotal = parseFloat(totalAmount.toFixed(2)); // Para evitar errores de coma flotante
  
      if (roundedTotal !== expectedCost) {
        alert(`La suma de los montos de las cuotas ($${roundedTotal}) no coincide con el costo total ($${expectedCost}).`);
        return;
      }

      // Asegurarse de que `quotaNumber` esté presente en cada cuota antes de guardar
      data.installments = data.installments.map((installment, index) => ({
        ...installment,
        quotaNumber: index + 1, // Asignar número de cuota automáticamente
      }));

  
      // Si pasa las validaciones, guardar
      if (params.id) {
        await updateEdition(params.id, data);
      } else {
        await createEdition(data);
      }
  
      navigate("/editions");
  
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  });

  return (
    <div className="page-wrapper">
  <div className="form-card">
    <h2 className="title">Edición</h2>

    {editionErrors.map((error, i) => (
      <div key={i} className="form-error">
        {error}
      </div>
    ))}

    <form onSubmit={onSubmit} className="form-grid">
      <div className="form-section">
        <label htmlFor="name" className="label">Nombre</label>
        <input
          type="text"
          placeholder="Nombre"
          {...register("name", { required: true })}
          className="form-input"
          autoFocus
        />
        {errors.name && (
          <p className="form-error">El nombre es requerido</p>
        )}
      </div>

      <div className="form-section">
        <label htmlFor="quantityCartons" className="label">Cantidad de cartones</label>
        <input
          type="number"
          placeholder="Cantidad de cartones"
          {...register("quantityCartons", { required: true })}
          className="form-input"
        />
        {errors.quantityCartons && (
          <p className="form-error">La cantidad de cartones es requerida</p>
        )}
      </div>

      <div className="form-section">
        <label htmlFor="cost" className="label">Costo</label>
        <input
          type="number"
          placeholder="Costo"
          {...register("cost", { required: true })}
          className="form-input"
        />
        {errors.cost && (
          <p className="form-error">El costo del cartón es requerido</p>
        )}
      </div>

      <div className="form-section">
        <label htmlFor="maxQuotas" className="label">Plan de cuotas</label>
        <input
          type="number"
          placeholder="Plan de cuotas"
          {...register("maxQuotas", { required: true })}
          className="form-input"
        />
        {errors.maxQuotas && (
          <p className="form-error">El plan de cuotas es requerido</p>
        )}
      </div>
      <div className="form-section">
        <label className="label">Cuotas</label>
        {fields.map((item, index) => (
          <div key={item.id} className="quota-row">
            <span className="form-label mt-4">Cuota N° {index + 1}</span>

            <input
              type="date"
              {...register(`installments.${index}.dueDate`, { required: true })}
              className="form-input"
            />
            <input
              type="number"
              placeholder="Monto"
              {...register(`installments.${index}.amount`, { required: true })}
              className="form-input"
            />
            <button type="button" onClick={() => remove(index)} className="btn-cancel">Eliminar cuota</button>
          </div>
        ))}

        <button type="button" onClick={() => append({ quotaNumber: "", dueDate: "", amount: "" })} className="btn-secondary mt-2">
          + Agregar cuota
        </button>
      </div>

      <div className="form-section">
        <button type="submit" className="btn-primary">Guardar</button>
      </div>
    </form>
  </div>
</div>
  );
}

export default EditionFormPage;
