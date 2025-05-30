import { useEffect, useState } from "react";
import { useSales } from "../../context/SaleContext";
import { useQuotas } from "../../context/QuotaContext";
import { useParams, useNavigate } from "react-router-dom";
import QuotaPaymentModal from "../../components/QuotaPaymentModal";
import FullPaymentModal from "../../components/FullPaymentModal";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

function SaleViewPage() {
  const { getSale, updateSale } = useSales();
  const { getQuotasBySale, updateQuota } = useQuotas();
  const [sale, setSale] = useState(null);
  const [quotas, setQuotas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState(null);
   const [isFullModalOpen, setIsFullModalOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSale = async () => {
      if (!params.id) return;

      try {
        const saleData = await getSale(params.id);
        setSale(saleData);

        if (saleData?._id) {
          const quotasData = await getQuotasBySale(params.id);
          setQuotas(Array.isArray(quotasData) ? quotasData : []);
        }
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };

    loadSale();
  }, [params.id, getSale, getQuotasBySale]);

  if (!sale) return <p className="text-gray-700 p-4">Cargando...</p>;

  const handleCancel = () => {
    navigate(-1);
  };

  const openModal = (quota) => {
    setSelectedQuota(quota);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuota(null);
  };

  const handleSaveQuota = async (updatedQuota) => {
    try {
      await updateQuota(updatedQuota._id, updatedQuota);
      const refreshedQuotas = await getQuotasBySale(sale._id);
      setQuotas(refreshedQuotas);
    } catch (error) {
      alert("Hubo un error al actualizar la cuota.");
    }
    closeModal();
  };

  const handleCancelPayment = async (quota) => {
    if (!window.confirm("¿Está seguro de que desea anular este pago?")) return;

    try {
      await updateQuota(quota._id, {
        ...quota,
        paymentDate: null,
        paymentMethod: null,
      });
      const refreshedQuotas = await getQuotasBySale(sale._id);
      setQuotas(refreshedQuotas);
      alert("El pago ha sido anulado correctamente.");
    } catch (error) {
      alert("Hubo un error al anular el pago.");
    }
  };

// Handlers Pago Completo
  const openFullModal = () => setIsFullModalOpen(true);
  const closeFullModal = () => setIsFullModalOpen(false);

  const handleFullPaymentSave = async (data) => {
    try {
      // 1) Marcar todas las cuotas
      const updatedQs = quotas.map((q) => ({
        ...q,
        paymentDate: data.date,
        paymentMethod: data.method,
      }));
      await Promise.all(updatedQs.map((q) => updateQuota(q._id, q)));

      // 2) Actualizar la sale con datos extra (si hay tarjeta)
      if (data.cardDetails) {
        console.log("Actualizando BingoCard:", sale._id, {
          fullPaymentMethod: data.method,
          lastFullPayment: data.date,
          ...data.cardDetails,
        });
        await updateSale(sale._id, {
          fullPaymentMethod: data.method,
          lastFullPayment: data.date,
          cardPaymentDetails: {
            ...data.cardDetails,
          },
        });
      }

      // 3) Recargar cuotas
      const refreshed = await getQuotasBySale(sale._id);
      setQuotas(refreshed);

      alert("Pago de contado registrado correctamente.");
    } catch (err) {
      console.error(err);
      alert("Error al procesar el pago completo.");
    } finally {
      closeFullModal();
    }
  };

  const totalVenta = quotas.reduce((acc, q) => acc + (q.amount || 0), 0);
  const totalPagado = quotas.reduce((acc, q) => acc + (q.paymentDate ? q.amount : 0), 0);
  const commissionRate = sale.seller?.commissionRate || 0;
  const totalComisiones = totalPagado * commissionRate / 100;
  const totalDeuda = totalVenta - totalPagado;

  const todasImpagas = quotas.length > 0 && quotas.every(q => !q.paymentDate && (!q.paymentMethod || q.paymentMethod === "Pendiente"));

  return (
    <div className="page-wide">
  <h1 className="title mb-4">Venta N° {sale.saleNumber || "Sin asignar"}</h1>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700 mb-8">
    <div>
      <p><span className="font-semibold">Edición:</span> {sale.edition?.name || "N/A"}</p>
      <p><span className="font-semibold">Número de Cartón:</span> {sale.bingoCard?.number || "N/A"}</p>
    </div>
    <div>
      <p><span className="font-semibold">Vendedor:</span> {sale.seller?.person?.firstName} {sale.seller?.person?.lastName || "N/A"}</p>
      <p><span className="font-semibold">Asociado:</span> {sale.client?.person?.firstName} {sale.client?.person?.lastName || "N/A"}</p>
    </div>
    <div>
      <p><span className="font-semibold">Estado:</span> {sale.status || "N/A"}</p>
      <p><span className="font-semibold">Fecha de Venta:</span> {dayjs.utc(sale.saleDate).format('DD/MM/YYYY')}</p>
    </div>
    <div className="md:col-span-2 lg:col-span-3 bg-gray-100 p-4 rounded shadow">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <p><strong>Total Pagado:</strong> ${totalPagado.toFixed(2)}</p>
        <p><strong>Total Deuda:</strong> ${totalDeuda.toFixed(2)}</p>
      </div>
    </div>
  </div>

  <h2 className="text-xl font-semibold text-gray-800 mb-2">Cuotas</h2>

  {quotas.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {quotas.map((quota) => (
        <div
          key={quota._id}
          className={`rounded-xl shadow-md p-4 border ${
            quota.paymentDate ? "border-green-400 bg-green-100" : "border-gray-300 bg-white"
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Cuota #{quota.quotaNumber}</h3>
          <p><span className="font-semibold">Vencimiento:</span> {dayjs.utc(quota.dueDate).format('DD/MM/YYYY')}</p>
          <p><span className="font-semibold">Monto:</span> ${quota.amount}</p>
          <p><span className="font-semibold">Pago:</span> {quota.paymentDate ? dayjs.utc(quota.paymentDate).format('DD/MM/YYYY') : "Pendiente"}</p>
          <p><span className="font-semibold">Método:</span> {quota.paymentMethod || "Pendiente"}</p>

          {sale.status !== "Anulada" ? (
            <div className="mt-4 flex gap-2">
              {quota.paymentDate ? (
                <button
                  onClick={() => handleCancelPayment(quota)}
                  className="btn-cancel flex items-center gap-1"
                >
                Anular Pago
                </button>
              ) : (
                <button
                  onClick={() => openModal(quota)}
                  className="btn-registrar"
                >
                  Registrar Pago
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mt-2">No disponible</p>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="empty-state">No hay cuotas asociadas a esta venta.</p>
  )}
  
  {/* Botón de Pago Completo */}
      {todasImpagas && (
        <div className="mb-4">
          <button
            onClick={openFullModal}
            className="btn-primary"
          >
            Pago de Contado
          </button>
        </div>
      )}

  <div className="mt-6">
    <button onClick={handleCancel} className="btn-view">
      Volver
    </button>
  </div>

  <QuotaPaymentModal
    isOpen={isModalOpen}
    onClose={closeModal}
    quota={selectedQuota}
    onSave={handleSaveQuota}
  />
  <FullPaymentModal
        isOpen={isFullModalOpen}
        onClose={closeFullModal}
        quotas={quotas}
        saleId={sale._id}
        bingoCardId={sale.bingoCard._id}
        onSave={handleFullPaymentSave}
      />
</div>
  );
}

export default SaleViewPage;
