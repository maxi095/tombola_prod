// manualDraw.mjs
import mongoose from "mongoose";
import dotenv from "dotenv";
import BingoCard from "../src/models/bingoCard.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tomboladb";
const currentEditionId = "683677d2ccc2fcf68b73523d";

async function simularSorteosConAnalisis({ cantidadDeSimulaciones = 1000 }) {
  await mongoose.connect(MONGODB_URI);
  console.log("🔄 Simulación de sorteos y análisis de cartones iniciada...");

  const cartones = await BingoCard.find({ edition: currentEditionId }, "_id numbers number");
  console.log(`🎫 Total de cartones cargados: ${cartones.length}`);

  const TOTAL_NUMEROS = 90;

  // --- Análisis de coincidencias entre cartones ---
  const coincidenciasEntreCartones = new Map();
  for (let i = 0; i < cartones.length; i++) {
    for (let j = i + 1; j < cartones.length; j++) {
      const setA = new Set(cartones[i].numbers);
      const setB = new Set(cartones[j].numbers);
      const interseccion = cartones[i].numbers.filter(num => setB.has(num));
      const key = `${cartones[i].number}-${cartones[j].number}`;
      coincidenciasEntreCartones.set(key, interseccion.length);
    }
  }

  // --- Análisis de frecuencia de aparición de números ---
  const frecuenciaNumeros = Array(TOTAL_NUMEROS + 1).fill(0);
  for (const carton of cartones) {
    for (const numero of carton.numbers) {
      frecuenciaNumeros[numero]++;
    }
  }

  // --- Rango por zonas (1-30, 31-60, 61-90) ---
  const zonaCount = { zona1: 0, zona2: 0, zona3: 0 };
  for (const carton of cartones) {
    for (const num of carton.numbers) {
      if (num <= 30) zonaCount.zona1++;
      else if (num <= 60) zonaCount.zona2++;
      else zonaCount.zona3++;
    }
  }

  // --- Análisis de desvío estándar ---
  const totalApariciones = frecuenciaNumeros.slice(1); // Ignoramos el índice 0
  const media = totalApariciones.reduce((a, b) => a + b, 0) / totalApariciones.length;
  const desvio = Math.sqrt(totalApariciones.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / totalApariciones.length);

  console.log(`📏 Desvío estándar en la aparición de números: ${desvio.toFixed(2)}`);

  // --- Análisis de suma de números por cartón ---
  const sumas = cartones.map(c => c.numbers.reduce((a, b) => a + b, 0));
  const promedioSuma = (sumas.reduce((a, b) => a + b, 0) / sumas.length).toFixed(2);
  const minSuma = Math.min(...sumas);
  const maxSuma = Math.max(...sumas);

  console.log(`🧮 Suma promedio de números por cartón: ${promedioSuma}`);
  console.log(`📉 Suma mínima: ${minSuma} / 📈 Suma máxima: ${maxSuma}`);

  // --- Análisis de cartones duplicados ---
  const setUnicos = new Set();
  let duplicados = 0;

  cartones.forEach((carton) => {
    const clave = carton.numbers.slice().sort((a, b) => a - b).join("-");
    if (setUnicos.has(clave)) {
      duplicados++;
    } else {
      setUnicos.add(clave);
    }
  });
  console.log(`🧾 Cartones duplicados detectados: ${duplicados}`);

  // --- Heatmap de aparición por decenas ---
  const decenas = Array(9).fill(0);
  frecuenciaNumeros.slice(1).forEach((count, i) => {
    const idx = Math.floor(i / 10);
    decenas[idx] += count;
  });

  decenas.forEach((total, i) => {
    const rango = `${i * 10 + 1}-${(i + 1) * 10}`;
    console.log(`📦 Decena ${rango}: ${total} apariciones`);
  });

  // --- Parejas de números que más se repiten juntas ---
  const conteoPares = new Map();
  cartones.forEach(({ numbers }) => {
    for (let i = 0; i < numbers.length; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        const key = `${Math.min(numbers[i], numbers[j])}-${Math.max(numbers[i], numbers[j])}`;
        conteoPares.set(key, (conteoPares.get(key) || 0) + 1);
      }
    }
  });
  const topPares = [...conteoPares.entries()].sort((a, b) => b[1] - a[1]).slice(0, 200);
  console.log("\n🔗 TOP 200 pares de números más frecuentes juntos:");
  topPares.forEach(([par, count]) => {
    console.log(`   ${par} → aparece en ${count} cartones`);
  });

  // --- Simulación de sorteos ---
  let sinGanador = 0;
  let totalBolillas = 0;
  let minBolillas = Infinity;
  let maxBolillas = 0;

  const ganadoresPorCarton = new Map();
  const ganadoresPorCantidad = new Map();
  const idToNumber = new Map();

  cartones.forEach(carton => {
    idToNumber.set(carton._id.toString(), carton.number);
  });

  for (let i = 0; i < cantidadDeSimulaciones; i++) {
    const bolillero = Array.from({ length: TOTAL_NUMEROS }, (_, i) => i + 1);
    for (let j = bolillero.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [bolillero[j], bolillero[k]] = [bolillero[k], bolillero[j]];
    }

    const numerosSorteados = new Set();
    let cantidadBolillasExtraidas = 0;
    let ganadores = [];

    for (let numero of bolillero) {
      numerosSorteados.add(numero);
      cantidadBolillasExtraidas++;
      ganadores = cartones.filter(carton =>
        carton.numbers.every(num => numerosSorteados.has(num))
      );
      if (ganadores.length > 0) break;
    }

    if (ganadores.length === 0) {
      sinGanador++;
    } else {
      totalBolillas += cantidadBolillasExtraidas;
      minBolillas = Math.min(minBolillas, cantidadBolillasExtraidas);
      maxBolillas = Math.max(maxBolillas, cantidadBolillasExtraidas);

      const numerosGanadores = ganadores.map(c => idToNumber.get(c._id.toString()));
      numerosGanadores.forEach(nro => {
        ganadoresPorCarton.set(nro, (ganadoresPorCarton.get(nro) || 0) + 1);
      });

      ganadoresPorCantidad.set(
        ganadores.length,
        (ganadoresPorCantidad.get(ganadores.length) || 0) + 1
      );
    }
  }

  const conGanador = cantidadDeSimulaciones - sinGanador;
  const promedioBolillas = conGanador > 0 ? (totalBolillas / conGanador).toFixed(2) : 0;

  const topCartones = [...ganadoresPorCarton.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

  // --- Mostrar análisis ---
  console.log("\n📊 ANÁLISIS DE LOS CARTONES");
  console.log("\n📌 Frecuencia de aparición de cada número (ordenado):");
  frecuenciaNumeros
    .map((count, num) => ({ num, count }))
    .slice(1)
    .sort((a, b) => b.count - a.count)
    .forEach(({ num, count }) => {
      console.log(`🎲 Nº ${num.toString().padStart(2, "0")}: aparece en ${count} cartones`);
    });

  console.log("\n🔍 Coincidencias entre pares de cartones (TOP 20):");
  [...coincidenciasEntreCartones.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([pair, count]) => {
      console.log(`🔗 ${pair} → ${count} coincidencias`);
    });

  console.log("\n📌 Distribución por zonas:");
  console.log(`   1-30: ${zonaCount.zona1} números`);
  console.log(`   31-60: ${zonaCount.zona2} números`);
  console.log(`   61-90: ${zonaCount.zona3} números`);

  console.log("\n📊 RESULTADOS DE LAS SIMULACIONES");
  console.log(`🔁 Total de simulaciones: ${cantidadDeSimulaciones}`);
  console.log(`   - Sin ganador: ${sinGanador}`);
  console.log(`   - Con ganador: ${conGanador}`);
  console.log(`   - Promedio de bolillas extraídas hasta el primer ganador: ${promedioBolillas}`);
  console.log(`   - Mínimo de bolillas extraídas: ${minBolillas}`);
  console.log(`   - Máximo de bolillas extraídas: ${maxBolillas}`);
  console.log("\n🧑‍🤝‍🧑 TOP 50 cartones con más ganadores:");
  topCartones.forEach(([carton, count], idx) => {
    console.log(`   ${idx + 1}. Cartón ${carton} → ${count} ganadores`);
  });

  console.log("✅ Simulación de sorteos y análisis finalizado.");
}

simularSorteosConAnalisis({ cantidadDeSimulaciones: 1000 });
