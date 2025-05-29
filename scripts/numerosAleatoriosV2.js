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


// Ejemplo de uso:
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

const resultado = optimizar(X, K, M, R, opciones);
console.log('Cartones optimizados:', resultado);