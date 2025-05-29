import { useEffect, useState } from "react";
import { useDashboard } from "../../context/DashboardContext";

import { useEditionFilter } from "../../context/EditionFilterContext";


export default function DashboardCartones() {
  const [editionId, setEditionId] = useState(null);
  const { dashboardData, loading, error, getDashboard } = useDashboard();
  const { selectedEdition } = useEditionFilter();

 
  // Cargar datos del dashboard según edición
  useEffect(() => {
    if (editionId) {
      console.log("Solicitando datos del dashboard para edición:", editionId);
      getDashboard(editionId);
    }
  }, [editionId, getDashboard]);

  useEffect(() => {
  if (selectedEdition) {
    setEditionId(selectedEdition);
  }
}, [selectedEdition]);


  if (loading && !dashboardData) return <p className="p-6">Cargando estadísticas...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  const {
    edition,
    expectedRevenueEdition,
    bingoCards,
    sales,
    quotas,
    sellerPayments
  } = dashboardData || {};

  const cartonesVendidos = bingoCards?.sold || 0;
  const cartonesTotales = bingoCards?.total || 0;
  const cartonesAsignados = bingoCards?.totalAssigned || 0;
  const cartonesPagados = sales?.paid || 0;
  const cuotasVencidas = quotas?.overdue || 0;
  const cuotasPagas = quotas?.paid || 0;
  const dineroCuotasPagas = quotas?.totalPaidAmount || 0;

  const dineroRecaudadoEfectivo = sellerPayments?.cash || 0;
  const dineroRecaudadoTransferencia = sellerPayments?.transfer || 0;
  const dineroRecaudadoCheque = sellerPayments?.check || 0;
  const dineroRecaudadoTarjetaUnica = sellerPayments?.tarjetaUnica || 0;
  const dineroRecaudado = sellerPayments?.total || 0;
  const dineroEsperado = expectedRevenueEdition || 0;
  const comisiones = sellerPayments?.commissions || 0;


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {editionId && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Estadísticas de la edición: {edition}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <KPI
              title="Cartones Vendidos"
              value={`${cartonesVendidos} / ${cartonesTotales}`}
              progress={cartonesTotales ? cartonesVendidos / cartonesTotales : 0}
              color="blue"
            />
            <KPI
              title="Cartones Pagados"
              value={`${cartonesPagados} / ${cartonesVendidos}`}
              progress={cartonesVendidos ? cartonesPagados / cartonesVendidos : 0}
              color="blue"
            />   
            <KPI title="Cartones asignados" value={cartonesAsignados} color="red" />
            <KPI title="Cuotas Vencidas" value={cuotasVencidas} color="red" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <KPI
              title="Dinero recaudado pago vendedores"
              value={`$${dineroRecaudado.toLocaleString()} / ${dineroEsperado.toLocaleString()}`}
              progress={dineroEsperado ? dineroRecaudado / dineroEsperado : 0}
              color="indigo"
            />
            <KPI
              title="Comisiones"
              value={`$${comisiones.toLocaleString()}`}
              color="yellow"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <KPI
              title="Recaudado en Efectivo"
              value={`$${dineroRecaudadoEfectivo.toLocaleString()}`}
              color="green"
            />
            <KPI
              title="Recaudado por Transferencia"
              value={`$${dineroRecaudadoTransferencia.toLocaleString()}`}
              color="blue"
            />
            <KPI
              title="Recaudado por Cheque"
              value={`$${dineroRecaudadoCheque.toLocaleString()}`}
              color="gray"
            />
            <KPI
              title="Recaudado por Tarjeta única"
              value={`$${dineroRecaudadoTarjetaUnica.toLocaleString()}`}
              color="gray"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <KPI title="Conciliación por cuotas pagas" value={`$${dineroCuotasPagas.toLocaleString()}`} color="green" />
            <KPI title="Cuotas pagas" value={cuotasPagas} color="green" />
          </div>
        </>
      )}
    </div>
  );

  // Componente KPI
  function KPI({ title, value, progress, color = "gray" }) {
    const colorClasses = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      red: "bg-red-500",
      indigo: "bg-indigo-500",
      yellow: "bg-yellow-400",
      gray: "bg-gray-400",
    };

    return (
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
        <p className="text-xl font-bold mb-2">{value}</p>
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded h-3">
            <div
              className={`h-3 rounded ${colorClasses[color]}`}
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        )}
      </div>
    );
  }
}
