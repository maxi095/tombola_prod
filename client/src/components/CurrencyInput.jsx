import React from "react";

export default function CurrencyInput({ label, name, register, errors }) {
  const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    return num.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });
  };

  const parseCurrency = (value) => {
    if (!value) return "";
    return value.replace(/[^\d.-]/g, "").replace(",", ".");
  };

  return (
    <div className="form-section">
      <label className="label">{label}</label>
      <input
        type="text"
        inputMode="decimal"
        className="form-input"
        placeholder="Ej: 1000.00"
        {...register(name, {
          onChange: (e) => {
            e.target.value = parseCurrency(e.target.value);
          },
          onBlur: (e) => {
            const parsed = parseFloat(e.target.value);
            if (!isNaN(parsed)) {
              e.target.value = formatCurrency(parsed);
            }
          },
          validate: (value) => {
            const parsed = parseFloat(parseCurrency(value));
            return (
              value === "" || !isNaN(parsed) || "Debe ser un número válido"
            );
          },
        })}
      />
      {errors?.[name] && (
        <p className="form-error">{errors[name].message}</p>
      )}
    </div>
  );
}
