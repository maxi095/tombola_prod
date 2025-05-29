/*
 * Bingo Cartones 100% Aleatorios con Simulated Annealing
 * Parámetros: x = cantidad de cartones, k = números por cartón, m = máximo número, r = ganadores secundarios
 */

// Genera un solo cartón con k números únicos del 1..m
function generarCarton(k, m) {
  const carton = new Set();
  while (carton.size < k) {
    const num = Math.floor(Math.random() * m) + 1;
    carton.add(num);
  }
  return Array.from(carton).sort((a, b) => a - b);
}

// Genera un arreglo inicial de x cartones (aleatorio simple)
function generarCartonesInicial(x, k, m) {
  const cartones = [];
  for (let i = 0; i < x; i++) {
    cartones.push(generarCarton(k, m));
  }
  return cartones;
}

// Simula nTrials sorteos y calcula probabilidades de empate
function simularEmpates(cartones, m, nTrials = 500, r = 3) {
  let empatePrimero = 0;
  let segundoExactoR = 0;

  for (let t = 0; t < nTrials; t++) {
    // Barajar números 1..m
    const bolas = Array.from({ length: m }, (_, i) => i + 1).
      sort(() => Math.random() - 0.5);

    // Calcula el índice de salida de cada cartón
    const tiempos = cartones.map(c => {
      // para cada número en el cartón, encuentra su posición en bolas
      const indices = c.map(num => bolas.indexOf(num));
      return Math.max(...indices);
    });

    const min1 = Math.min(...tiempos);
    const ganadores1 = tiempos.filter(ti => ti === min1).length;
    if (ganadores1 > 1) empatePrimero++;
    
    // Para los que no ganaron primero, buscamos el segundo tiempo
    const tiemposSinPrimero = tiempos.slice().map(ti => (ti === min1 ? Infinity : ti));
    const min2 = Math.min(...tiemposSinPrimero);
    const secundarios = tiemposSinPrimero.filter(ti => ti === min2).length;
    if (secundarios === r) segundoExactoR++;
  }

  return {
    pEmpatePrimero: empatePrimero / nTrials,
    pSegundoExactoR: segundoExactoR / nTrials
  };
}

// Función de costo
function costo(cartones, m, r, w = 1.0) {
  const { pEmpatePrimero, pSegundoExactoR } = simularEmpates(cartones, m, 300, r);
  return pEmpatePrimero + w * Math.abs(pSegundoExactoR - 1);
}

// Genera un vecino intercambiando un número en un cartón aleatorio
function neighbor(cartones, k, m) {
  const copia = cartones.map(c => c.slice());
  const idx = Math.floor(Math.random() * copia.length);
  const carton = new Set(copia[idx]);

  // quitar un número aleatorio
  const arr = Array.from(carton);
  const quitar = arr[Math.floor(Math.random() * arr.length)];
  carton.delete(quitar);

  // agregar número distinto
  let intento;
  do {
    intento = Math.floor(Math.random() * m) + 1;
  } while (carton.has(intento));
  carton.add(intento);

  copia[idx] = Array.from(carton).sort((a, b) => a - b);
  return copia;
}

// Simulated Annealing principal
function optimizar(x, k, m, r, maxIter = 5000) {
  let curr = generarCartonesInicial(x, k, m);
  let best = curr;
  let bestCost = costo(best, m, r);
  let T = 1.0;

  for (let i = 0; i < maxIter; i++) {
    const cand = neighbor(curr, k, m);
    const cCand = costo(cand, m, r);
    const delta = cCand - bestCost;

    if (delta < 0 || Math.random() < Math.exp(-delta / T)) {
      curr = cand;
      if (cCand < bestCost) {
        best = cand;
        bestCost = cCand;
        console.log(`Nuevo mejor costo ${bestCost.toFixed(4)} en iter ${i}`);
      }
    }
    T *= 0.995; // factor de enfriamiento
    if (bestCost === 0) break;
  }

  return best;
}

// Ejemplo de uso
const X = 816, K = 15, M = 90, R = 3;
console.log("Iniciando optimización...");
const resultado = optimizar(X, K, M, R);
console.log("Conjunto óptimo de cartones:", resultado);