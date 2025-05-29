import ReactModal from "react-modal";
import { useState, useEffect } from "react";
import { useBingoCards} from "../context/BingoCardContext";

ReactModal.setAppElement("#root");

const AssignBingoCardsModal = ({ isOpen, onClose, sellerId }) => {
  const { bingoCards, assignSellerToBingoCard, getBingoCards } = useBingoCards();
  const [edition, setEdition] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);
  const [unassignedCards, setUnassignedCards] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

// Antes de renderizar
const filteredCards = unassignedCards.filter(card => {
  const search = searchTerm.toLowerCase();
  const numberMatch = card.number?.toString().includes(search);
  const editionMatch = card.edition?.name?.toLowerCase().includes(search);
  return numberMatch || editionMatch;
});


  useEffect(() => {
    const fetchUnassignedCards = async () => {
      if (!isOpen) return;

      const cards = await getBingoCards(); // Esperamos los datos directamente
      if (!cards) return; // En caso de error o respuesta nula

      const cardsWithoutSeller = cards.filter(
        (card) => !card.seller || Object.keys(card.seller).length === 0
      );

      console.log("📋 Cartones sin asignar:", cardsWithoutSeller); // DEBUG
      setUnassignedCards(cardsWithoutSeller);
    };

    fetchUnassignedCards();
  }, [isOpen, getBingoCards]);

  const handleCheckboxChange = (cardId) => {
    setSelectedCards(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCards.length === 0) return; // Solo verifica que haya cartones seleccionados
  
    for (const cardId of selectedCards) {
      await assignSellerToBingoCard(cardId, sellerId);
    }
    onClose(); 
    setSelectedCards([]);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]"
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <h2 className="text-2xl font-semibold mb-4">Asignar Cartones al Vendedor</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 
        <div>
          <label className="label">Edición</label>
          <input
            type="text"
            className="form-input"
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
            required
          />
        </div>
        */}

<div>
  <label className="label">Cartones sin asignar</label>

  {/* 🔍 Buscador */}
  <input
    type="text"
    placeholder="Buscar por número o edición..."
    className="form-input mb-2"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <div className="max-h-64 overflow-y-auto border p-2 rounded">
    {filteredCards.length === 0 ? (
      <p className="text-gray-500 text-sm">No hay cartones disponibles</p>
    ) : (
      filteredCards.map(card => (
        <label key={card._id} className="block">
          <input
            type="checkbox"
            checked={selectedCards.includes(card._id)}
            onChange={() => handleCheckboxChange(card._id)}
            className="mr-2"
          />
          Cartón N° {card.number} (Edición {card.edition?.name || "Sin edición"}) 
        </label>
      ))
    )}
  </div>
</div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Asignar
          </button>
        </div>
      </form>
    </ReactModal>
  );
};

export default AssignBingoCardsModal;
