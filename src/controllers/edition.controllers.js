import Edition from '../models/edition.model.js';
import BingoCard from '../models/bingoCard.model.js';
import Quota from '../models/quota.model.js';

export const getEditions = async (req, res) => {
    try {
        const editions = await Edition.find({}).populate('user'); // Populate para incluir detalles del usuario si es necesario
        res.json(editions);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/*export const createEdition = async (req, res) => {
    try {
        const { name, quantityCartons, cost, maxQuotas } = req.body;

        // Verificar si ya existe una edición con el mismo nombre
        const existingEdition = await Edition.findOne({ name });
        if (existingEdition) {
            return res.status(400).json({ message: 'Edition name must be unique' });
        }

        // Crear la nueva edición si el nombre es único
        const newEdition = new Edition({
            name,
            quantityCartons,
            cost,
            maxQuotas,
            user: req.user.id
        });

        // Guardar la edición y devolver la respuesta
        const savedEdition = await newEdition.save();
        res.json(savedEdition);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}; */

/*export const createEdition = async (req, res) => {
    try {
        const { name, quantityCartons, cost, maxQuotas } = req.body;

        // Verificar si ya existe una edición con el mismo nombre
        const existingEdition = await Edition.findOne({ name });
        if (existingEdition) {
            return res.status(400).json({ message: 'Edition name must be unique' });
        }

        // Crear la nueva edición
        const newEdition = new Edition({
            name,
            quantityCartons,
            cost,
            maxQuotas,
            user: req.user.id
        });

        const savedEdition = await newEdition.save();

        // Crear tarjetas de bingo
        const bingoCards = [];
        for (let i = 1; i <= quantityCartons; i++) {
            bingoCards.push({
                edition: savedEdition._id,
                number: i,
                status: 'Disponible',
                user: req.user.id
            });
        }

        await BingoCard.insertMany(bingoCards);

        res.json({ edition: savedEdition, bingoCardsCreated: quantityCartons });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}; */


// Función auxiliar para generar los números



    function generarCartonesSinSolapes(cantidad = 816, maxSolapamiento = 6) {
    const TOTAL_NUMEROS = 15;
    const MAX_NUMERO = 90;
    const cartones = [];

    const usado = new Set();

    function contarCoincidencias(a, b) {
        const setB = new Set(b);
        return a.reduce((acc, num) => acc + setB.has(num), 0);
    }

    function generarCarton() {
        const carton = new Set();
        while (carton.size < TOTAL_NUMEROS) {
            const num = Math.floor(Math.random() * MAX_NUMERO) + 1;
            carton.add(num);
        }
        return [...carton].sort((a, b) => a - b);
    }

    const ganador = generarCarton();
    cartones.push(ganador);
    usado.add(ganador.join(","));

    while (cartones.length < cantidad) {
        let nuevo;
        let intentos = 0;
        do {
            nuevo = generarCarton();
            intentos++;
        } while (
            (usado.has(nuevo.join(",")) ||
                contarCoincidencias(nuevo, ganador) > maxSolapamiento) &&
            intentos < 500
        );

        cartones.push(nuevo);
        usado.add(nuevo.join(","));
    }

    return cartones;
}

//----------------

// Utilidades
function fisherYates(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function coincidenciasEntreCartones(a, b) {
  let setA = new Set(a);
  return b.filter(x => setA.has(x)).length;
}

// Genera un cartón con k números del 1 a m
function generarCarton(k, m) {
  const carton = new Set();
  while (carton.size < k) {
    const num = Math.floor(Math.random() * m) + 1;
    carton.add(num);
  }
  return Array.from(carton).sort((a, b) => a - b);
}

// Genera un arreglo de x cartones
function generarCartonesInicial(x, k, m) {
  const cartones = [];
  for (let i = 0; i < x; i++) {
    cartones.push(generarCarton(k, m));
  }
  return cartones;
}

// Simula sorteos y calcula probabilidades
function simularEmpates(cartones, m, nTrials = 500, r = 3) {
  let empatePrimero = 0, segundoExactoR = 0;
  const bolas = Array.from({ length: m }, (_, i) => i + 1);

  for (let t = 0; t < nTrials; t++) {
    fisherYates(bolas);
    const pos = new Uint16Array(m + 1);
    for (let i = 0; i < m; i++) pos[bolas[i]] = i;

    const tiempos = cartones.map(c =>
      c.reduce((mx, num) => Math.max(mx, pos[num]), 0)
    );

    const min1 = Math.min(...tiempos);
    const ganadores1 = tiempos.filter(ti => ti === min1).length;
    if (ganadores1 > 1) empatePrimero++;

    const tiemposSinPrimero = tiempos.map(ti => (ti === min1 ? Infinity : ti));
    const min2 = Math.min(...tiemposSinPrimero);
    const secundarios = tiemposSinPrimero.filter(ti => ti === min2).length;
    if (secundarios === r) segundoExactoR++;
  }

  return {
    pEmpatePrimero: empatePrimero / nTrials,
    pSegundoExactoR: segundoExactoR / nTrials
  };
}

function penalizacion(matrizCoinc, maxCoincidencias) {
  let penal = 0;
  for (let i = 0; i < matrizCoinc.length; i++) {
    for (let j = i + 1; j < matrizCoinc.length; j++) {
      if (matrizCoinc[i][j] > maxCoincidencias) penal++;
    }
  }
  return penal;
}

function costo(cartones, m, r, matrizCoinc, options) {
  const trials = options.currentTemp > 0.1 ? 100 : 1000;
  const { pEmpatePrimero, pSegundoExactoR } = simularEmpates(cartones, m, trials, r);
  const penal = penalizacion(matrizCoinc, options.maxCoincidencias || 8);
  return pEmpatePrimero + options.w * Math.abs(pSegundoExactoR - 1) + options.alpha * penal;
}

// Genera un vecino y devuelve también el índice modificado
function neighbor(cartones, k, m) {
  const copia = cartones.map(c => c.slice());
  const idx = Math.floor(Math.random() * copia.length);
  const carton = new Set(copia[idx]);

  const arr = Array.from(carton);
  const quitar = arr[Math.floor(Math.random() * arr.length)];
  carton.delete(quitar);

  let intento;
  do {
    intento = Math.floor(Math.random() * m) + 1;
  } while (carton.has(intento));
  carton.add(intento);

  copia[idx] = Array.from(carton).sort((a, b) => a - b);
  return { nuevo: copia, modificado: idx };
}

function optimizar(x, k, m, r, maxIter = 5000, opciones = {}) {
  let curr = generarCartonesInicial(x, k, m);
  let matrizCoinc = Array(x).fill().map(() => Array(x).fill(0));
  for (let i = 0; i < x; i++)
    for (let j = i + 1; j < x; j++)
      matrizCoinc[i][j] = coincidenciasEntreCartones(curr[i], curr[j]);

  let best = curr;
  let bestCost = costo(curr, m, r, matrizCoinc, { ...opciones, currentTemp: 1.0 });
  let T = 1.0;

  for (let i = 0; i < maxIter; i++) {
    const { nuevo: cand, modificado: idx } = neighbor(curr, k, m);

    let nuevaMatriz = matrizCoinc.map((fila, j) =>
      fila.map((val, k) => (j === idx || k === idx ? 0 : val))
    );

    for (let j = 0; j < x; j++) {
      if (j === idx) continue;
      const c1 = cand[idx], c2 = cand[j];
      const c = coincidenciasEntreCartones(c1, c2);
      if (j < idx) nuevaMatriz[j][idx] = c;
      else nuevaMatriz[idx][j] = c;
    }

    const cCand = costo(cand, m, r, nuevaMatriz, { ...opciones, currentTemp: T });
    const delta = cCand - bestCost;

    if (delta < 0 || Math.random() < Math.exp(-delta / T)) {
      curr = cand;
      matrizCoinc = nuevaMatriz;
      if (cCand < bestCost) {
        best = cand;
        bestCost = cCand;
        console.log(`Nuevo mejor costo ${bestCost.toFixed(4)} en iter ${i}`);
      }
    }

    T *= 0.995;
    if (bestCost === 0) break;
  }

  return best;
}






export const createEdition = async (req, res) => {
    try {
        const { name, quantityCartons, cost, maxQuotas, installments } = req.body;

        // Verificar si ya existe una edición con el mismo nombre
        const existingEdition = await Edition.findOne({ name });
        if (existingEdition) {
            return res.status(400).json({ message: 'Edition name must be unique' });
        }

        // Crear la nueva edición
        const newEdition = new Edition({
            name,
            quantityCartons,
            cost,
            maxQuotas,
            installments,
            user: req.user.id
        });

        const savedEdition = await newEdition.save();

        // Crear tarjetas de bingo asociadas a la edición
        const bingoCards = [];


        //const numerosGenerados = generarCartonesSinSolapes();


        console.log("Iniciando optimización...");

        const X = 816;
        const K = 15;
        const M = 90;
        const R = 3;
        const opciones = {
          simTrials: 1000,
          maxCoincidenciasPermitidas: 9,
          wSegundo: 1.0,
          wCoincidencias: 0.05,
          maxIter: 15000,
          initialTemp: 1.0,
          coolingRate: 0.995
        };
        const numerosGenerados = optimizar(X, K, M, R, opciones);

        for (let i = 1; i <= quantityCartons; i++) {
            const bingoCard = new BingoCard({
                edition: savedEdition._id,
                number: i,
                status: 'Disponible',
                numbers: numerosGenerados[i - 1], // asigna los 15 números
                user: req.user.id
            });

            bingoCards.push(bingoCard);
        }

        // Insertar las tarjetas de bingo en la BD
        const savedBingoCards = await BingoCard.insertMany(bingoCards);

        /* 
        // Código comentado: Generación de cuotas
        const quotaAmount = cost / maxQuotas;
        const quotas = [];

        savedBingoCards.forEach((bingoCard) => {
            for (let j = 1; j <= maxQuotas; j++) {
                quotas.push({
                    bingoCard: bingoCard._id, 
                    quotaNumber: j,
                    dueDate: new Date(new Date().setMonth(new Date().getMonth() + j)), 
                    amount: quotaAmount,
                    paymentDate: null,
                    paymentMethod: null
                });
            }
        });

        await Quota.insertMany(quotas);
        */

        res.json({
            edition: savedEdition,
            bingoCardsCreated: savedBingoCards.length
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getEdition = async (req, res) => {
    try {
        const edition = await Edition.findById(req.params.id).populate('user');
        if (!edition) return res.status(404).json({ message: 'Edition not found' });
        res.json(edition);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteEdition = async (req, res) => {
    try {
        const edition = await Edition.findByIdAndDelete(req.params.id);
        if (!edition) return res.status(404).json({ message: 'Edition not found' });
        return res.status(204).json({ message: 'Edition deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateEdition = async (req, res) => {
    try {
        const edition = await Edition.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user');
        if (!edition) return res.status(404).json({ message: 'Edition not found' });
        res.json(Edition);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
