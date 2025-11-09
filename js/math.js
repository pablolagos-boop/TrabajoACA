/**
 * Módulo de utilidades matemáticas para la calculadora
 * Exporta funciones puras que evitan efectos secundarios y facilitan pruebas.
 */

function getDecimalPlaces(num) {
  const s = String(num)
  if (s.indexOf('.') === -1) return 0
  return s.split('.')[1].length
}

function toIntegerScaled(num, scale) {
  return Math.round(Number(num) * scale)
}

function preciseAdd(a, b) {
  const da = getDecimalPlaces(a)
  const db = getDecimalPlaces(b)
  const scale = Math.pow(10, Math.max(da, db))
  const ai = toIntegerScaled(a, scale)
  const bi = toIntegerScaled(b, scale)
  return (ai + bi) / scale
}

function preciseSubtract(a, b) {
  const da = getDecimalPlaces(a)
  const db = getDecimalPlaces(b)
  const scale = Math.pow(10, Math.max(da, db))
  const ai = toIntegerScaled(a, scale)
  const bi = toIntegerScaled(b, scale)
  return (ai - bi) / scale
}

function preciseMultiply(a, b) {
  const da = getDecimalPlaces(a)
  const db = getDecimalPlaces(b)
  const scaleA = Math.pow(10, da)
  const scaleB = Math.pow(10, db)
  const ai = toIntegerScaled(a, scaleA)
  const bi = toIntegerScaled(b, scaleB)
  return (ai * bi) / (scaleA * scaleB)
}

function preciseDivide(a, b) {
  // Añadir escala para mantener precisión
  const da = getDecimalPlaces(a)
  const db = getDecimalPlaces(b)
  const scale = Math.pow(10, Math.max(da, db) + 6)
  const ai = toIntegerScaled(a, scale)
  const bi = toIntegerScaled(b, scale)
  return ai / bi
}

function roundResult(num) {
  return Math.round(num * 1000000000) / 1000000000
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}

function formatNumber(num) {
  const number = Number.parseFloat(num)
  if (isNaN(number)) return num

  if (Math.abs(number) > 999999999 || (Math.abs(number) < 0.000001 && number !== 0)) {
    return number.toExponential(6)
  }

  return number.toString()
}

// Exportar para CommonJS (tests) y exponer como window.math para uso en navegador
const exported = {
  getDecimalPlaces,
  toIntegerScaled,
  preciseAdd,
  preciseSubtract,
  preciseMultiply,
  preciseDivide,
  roundResult,
  toRadians,
  formatNumber,
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = exported
} else if (typeof window !== "undefined") {
  window.math = exported
}
