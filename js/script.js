/**
 * Calculadora Científica Profesional
 * @author v0
 * @version 1.0.0
 * @description Calculadora completa con funciones científicas, memoria e historial
 */

/**
 * Clase principal de la calculadora
 */
// Cargar el módulo math de forma segura (CommonJS en tests o `window.math` en navegador)
let math
try {
  if (typeof require !== 'undefined') {
    math = require('./math')
  }
} catch (e) {
  // ignore
}
if (!math && typeof window !== 'undefined' && window.math) {
  math = window.math
}

// Nota: se mantienen métodos wrapper en la clase que delegan en el módulo `math`.

class ScientificCalculator {
  /**
   * Constructor de la calculadora
   */
  constructor() {
    this.currentValue = "0"
    this.previousValue = ""
    this.operation = null
    this.memory = 0
    this.history = []
    this.waitingForNewValue = false
    this.errorState = false

    // Elementos del DOM
    this.expressionDisplay = document.getElementById("expression")
    this.resultDisplay = document.getElementById("result")
    this.memoryIndicator = document.getElementById("memoryIndicator")
    this.historyList = document.getElementById("historyList")
    this.clearHistoryBtn = document.getElementById("clearHistoryBtn")

    this.initializeEventListeners()
    this.updateDisplay()
  }

  /**
   * Inicializa los event listeners de los botones
   */
  initializeEventListeners() {
    // Botones numéricos
    document.querySelectorAll(".btn-number").forEach((btn) => {
      // asignar aria-label si no existe
      if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', btn.textContent.trim())
      btn.addEventListener("click", (e) => {
        if (this.errorState) return
        this.inputNumber(e.target.dataset.value)
      })
    })

    // Botones de operadores
    document.querySelectorAll(".btn-operator").forEach((btn) => {
      if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', btn.textContent.trim())
      btn.addEventListener("click", (e) => {
        if (this.errorState) return
        this.handleOperator(e.target.dataset.action)
      })
    })

    // Botones de funciones
    document.querySelectorAll(".btn-function").forEach((btn) => {
      if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', btn.textContent.trim())
      btn.addEventListener("click", (e) => {
        if (this.errorState) return
        this.handleFunction(e.target.dataset.action)
      })
    })

    // Botones de memoria
    document.querySelectorAll(".btn-memory").forEach((btn) => {
      if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', btn.textContent.trim())
      btn.addEventListener("click", (e) => {
        if (this.errorState) return
        this.handleMemory(e.target.dataset.action)
      })
    })

    // Botón de limpiar
    document.querySelector(".btn-clear").addEventListener("click", () => {
      this.clear()
    })

    // Botón de igual
    document.querySelector(".btn-equals").addEventListener("click", () => {
      if (this.errorState) return
      this.calculate()
    })

    // Botón de limpiar historial
    this.clearHistoryBtn.addEventListener("click", () => {
      this.clearHistory()
    })

    // Soporte de teclado
    document.addEventListener("keydown", (e) => {
      if (this.errorState && e.key !== 'Escape' && e.key !== 'c' && e.key !== 'C') return
      this.handleKeyboard(e)
    })
  }

  /**
   * Maneja la entrada de números
   * @param {string} num - Número o punto decimal a ingresar
   */
  inputNumber(num) {
    if (this.waitingForNewValue) {
      this.currentValue = num
      this.waitingForNewValue = false
    } else {
      if (num === "." && this.currentValue.includes(".")) {
        return // No permitir múltiples puntos decimales
      }
      this.currentValue = this.currentValue === "0" ? num : this.currentValue + num
    }
    this.updateDisplay()
  }

  /**
   * Maneja los operadores básicos
   * @param {string} operator - Tipo de operador (add, subtract, multiply, divide)
   */
  handleOperator(operator) {
    const current = Number.parseFloat(this.currentValue)

    if (this.operation && this.waitingForNewValue) {
      this.operation = operator
      this.updateDisplay()
      return
    }

    if (this.previousValue === "") {
      this.previousValue = current.toString()
    } else if (this.operation) {
      try {
        const result = this.performOperation()
        this.currentValue = result.toString()
        this.previousValue = result.toString()
      } catch (error) {
        this.showError(error.message)
        return
      }
    }

    this.operation = operator
    this.waitingForNewValue = true
    this.updateDisplay()
  }

  /**
   * Realiza la operación matemática
   * @returns {number} Resultado de la operación
   */
  performOperation() {
    const prev = Number.parseFloat(this.previousValue)
    const current = Number.parseFloat(this.currentValue)
    let result = 0

    switch (this.operation) {
      case "add":
        result = this.preciseAdd(prev, current)
        break
      case "subtract":
        result = this.preciseSubtract(prev, current)
        break
      case "multiply":
        result = this.preciseMultiply(prev, current)
        break
      case "divide":
        if (current === 0) {
          // Lanzar error para que el llamador lo gestione y mostrar mensaje claro
          throw new Error("No se puede dividir por cero")
        }
        result = this.preciseDivide(prev, current)
        break
      default:
        return current
    }

    return this.roundResult(result)
  }

  /**
   * Utilidades de aritmética precisa para mitigar errores de coma flotante
   * Trabaja con números razonablemente pequeños (como en una calculadora de UI)
   */
  getDecimalPlaces(num) {
    return math.getDecimalPlaces(num)
  }

  toIntegerScaled(num, scale) {
    return math.toIntegerScaled(num, scale)
  }

  preciseAdd(a, b) {
    return math.preciseAdd(a, b)
  }

  preciseSubtract(a, b) {
    return math.preciseSubtract(a, b)
  }

  preciseMultiply(a, b) {
    return math.preciseMultiply(a, b)
  }

  preciseDivide(a, b) {
    return math.preciseDivide(a, b)
  }

  /**
   * Maneja las funciones científicas
   * @param {string} func - Tipo de función científica
   */
  handleFunction(func) {
    const current = Number.parseFloat(this.currentValue)
    let result = 0
    let expression = ""

    try {
      switch (func) {
        case "sin":
          result = Math.sin(this.toRadians(current))
          expression = `sin(${current})`
          break
        case "cos":
          result = Math.cos(this.toRadians(current))
          expression = `cos(${current})`
          break
        case "tan":
          result = Math.tan(this.toRadians(current))
          expression = `tan(${current})`
          break
        case "log":
          if (current <= 0) {
            throw new Error("El logaritmo requiere un número positivo")
          }
          result = Math.log10(current)
          expression = `log(${current})`
          break
        case "sqrt":
          if (current < 0) {
            throw new Error("No se puede calcular la raíz de un número negativo")
          }
          result = Math.sqrt(current)
          expression = `√(${current})`
          break
        case "power":
          result = Math.pow(current, 2)
          expression = `${current}²`
          break
        case "percent":
          result = current / 100
          expression = `${current}%`
          break
        case "reciprocal":
          if (current === 0) {
            throw new Error("No se puede calcular el recíproco de cero")
          }
          result = 1 / current
          expression = `1/${current}`
          break
        case "negate":
          result = current * -1
          expression = `-(${current})`
          break
      }

      result = this.roundResult(result)
      this.addToHistory(expression, result)
      this.currentValue = result.toString()
      this.waitingForNewValue = true
      this.updateDisplay()
    } catch (error) {
      this.showError(error.message)
    }
  }

  /**
   * Maneja las funciones de memoria
   * @param {string} action - Acción de memoria (memory-clear, memory-recall, memory-add, memory-subtract)
   */
  handleMemory(action) {
    const current = Number.parseFloat(this.currentValue)

    switch (action) {
      case "memory-clear":
        this.memory = 0
        break
      case "memory-recall":
        this.currentValue = this.memory.toString()
        this.waitingForNewValue = true
        break
      case "memory-add":
        this.memory += current
        break
      case "memory-subtract":
        this.memory -= current
        break
    }

    this.updateMemoryDisplay()
    this.updateDisplay()
  }

  /**
   * Calcula el resultado de la operación actual
   */
  calculate() {
    if (this.operation && !this.waitingForNewValue) {
      try {
        const result = this.performOperation()
        const expression = `${this.previousValue} ${this.getOperatorSymbol()} ${this.currentValue}`

        this.addToHistory(expression, result)
        this.currentValue = result.toString()
        this.previousValue = ""
        this.operation = null
        this.waitingForNewValue = true
        this.updateDisplay()
      } catch (error) {
        this.showError(error.message)
      }
    }
  }

  /**
   * Limpia la calculadora
   */
  clear() {
    this.currentValue = "0"
    this.previousValue = ""
    this.operation = null
    this.waitingForNewValue = false
    this.errorState = false
    this.updateDisplay()
  }

  /**
   * Actualiza la pantalla de la calculadora
   */
  updateDisplay() {
    this.resultDisplay.textContent = this.formatNumber(this.currentValue)

    if (this.operation && this.previousValue) {
      this.expressionDisplay.textContent = `${this.formatNumber(this.previousValue)} ${this.getOperatorSymbol()}`
    } else {
      this.expressionDisplay.textContent = this.currentValue === "0" ? "0" : this.formatNumber(this.currentValue)
    }
  }

  /**
   * Actualiza el indicador de memoria
   */
  updateMemoryDisplay() {
    if (this.memory !== 0) {
      this.memoryIndicator.textContent = `Memoria: ${this.formatNumber(this.memory.toString())}`
    } else {
      this.memoryIndicator.textContent = ""
    }
    // accesibilidad: anunciar cambios de memoria
    if (this.memoryIndicator) this.memoryIndicator.setAttribute('aria-live', 'polite')
  }

  /**
   * Agrega una operación al historial
   * @param {string} expression - Expresión matemática
   * @param {number} result - Resultado de la operación
   */
  addToHistory(expression, result) {
    const historyItem = {
      expression,
      result,
      timestamp: new Date().toLocaleTimeString(),
    }

    this.history.unshift(historyItem)

    // Limitar historial a 10 elementos
    if (this.history.length > 10) {
      this.history.pop()
    }

    this.updateHistoryDisplay()
  }

  /**
   * Actualiza la visualización del historial
   */
  updateHistoryDisplay() {
    // Limpiar contenido previo
    while (this.historyList.firstChild) {
      this.historyList.removeChild(this.historyList.firstChild)
    }

    if (this.history.length === 0) {
      const p = document.createElement("p")
      p.className = "no-history"
      p.textContent = "Sin operaciones previas"
      // accesibilidad: marcar lista vacía
      this.historyList.setAttribute('role', 'list')
      p.setAttribute('role', 'listitem')
      this.historyList.appendChild(p)
      return
    }

    // Crear elementos de historial de forma segura (sin innerHTML)
    this.history.forEach((item) => {
  const itemDiv = document.createElement("div")
  itemDiv.className = "history-item"
  itemDiv.dataset.result = String(item.result)
  itemDiv.setAttribute('role', 'listitem')

      const exprDiv = document.createElement("div")
      exprDiv.textContent = `${item.expression} = ${this.formatNumber(item.result.toString())}`

      const timeDiv = document.createElement("div")
      timeDiv.style.fontSize = "12px"
      timeDiv.style.color = "var(--text-secondary)"
      timeDiv.style.marginTop = "4px"
      timeDiv.textContent = item.timestamp

      itemDiv.appendChild(exprDiv)
      itemDiv.appendChild(timeDiv)

      itemDiv.addEventListener("click", (e) => {
        const result = e.currentTarget.dataset.result
        this.currentValue = result
        this.waitingForNewValue = true
        this.updateDisplay()
      })

      this.historyList.setAttribute('role', 'list')
      this.historyList.appendChild(itemDiv)
    })
  }

  /**
   * Limpia el historial
   */
  clearHistory() {
    this.history = []
    this.updateHistoryDisplay()
  }

  /**
   * Maneja la entrada del teclado
   * @param {KeyboardEvent} e - Evento de teclado
   */
  handleKeyboard(e) {
    if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
      this.inputNumber(e.key)
    } else if (e.key === "Enter" || e.key === "=") {
      e.preventDefault()
      this.calculate()
    } else if (e.key === "Escape" || e.key === "c") {
      this.clear()
    } else if (e.key === "+") {
      this.handleOperator("add")
    } else if (e.key === "-") {
      this.handleOperator("subtract")
    } else if (e.key === "*") {
      this.handleOperator("multiply")
    } else if (e.key === "/") {
      e.preventDefault()
      this.handleOperator("divide")
    }
  }

  /**
   * Muestra un mensaje de error
   * @param {string} message - Mensaje de error
   */
  showError(message) {
    this.resultDisplay.textContent = "Error"
    this.expressionDisplay.textContent = message
    this.resultDisplay.classList.add("error")
    // Mantener el estado de error hasta que el usuario limpie (mejora usabilidad)
    this.errorState = true
    // Añadir atributo aria-live para anunciar error inmediatamente
    if (this.resultDisplay) this.resultDisplay.setAttribute('aria-live', 'assertive')
  }

  /**
   * Convierte grados a radianes
   * @param {number} degrees - Ángulo en grados
   * @returns {number} Ángulo en radianes
   */
  toRadians(degrees) {
    return math.toRadians(degrees)
  }

  /**
   * Redondea el resultado a un número manejable de decimales
   * @param {number} num - Número a redondear
   * @returns {number} Número redondeado
   */
  roundResult(num) {
    return math.roundResult(num)
  }

  /**
   * Formatea un número para mostrar
   * @param {string} num - Número a formatear
   * @returns {string} Número formateado
   */
  formatNumber(num) {
    return math.formatNumber(num)
  }

  /**
   * Obtiene el símbolo del operador actual
   * @returns {string} Símbolo del operador
   */
  getOperatorSymbol() {
    const symbols = {
      add: "+",
      subtract: "−",
      multiply: "×",
      divide: "÷",
    }
    return symbols[this.operation] || ""
  }
}

// Inicializar la calculadora cuando el DOM esté listo (solo en navegador)
if (!(typeof module !== "undefined" && module.exports)) {
  document.addEventListener("DOMContentLoaded", () => {
    const calculator = new ScientificCalculator()
    console.log("[v0] Calculadora científica inicializada correctamente")
  })
}

// Exponer la clase para pruebas unitarias (CommonJS / navegador)
if (typeof module !== "undefined" && module.exports) {
  module.exports = ScientificCalculator
} else {
  window.ScientificCalculator = ScientificCalculator
}
