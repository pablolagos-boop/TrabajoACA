const ScientificCalculator = require('../script')

function setupDOM() {
  document.body.innerHTML = `
    <div id="expression"></div>
    <div id="result"></div>
    <div id="memoryIndicator"></div>
    <div id="historyList"></div>
    <button id="clearHistoryBtn"></button>
    <button class="btn-clear"></button>
    <button class="btn-equals"></button>
    <button class="btn-number" data-value="1"></button>
    <button class="btn-operator" data-action="add"></button>
    <button class="btn-function" data-action="sin"></button>
    <button class="btn-memory" data-action="memory-clear"></button>
  `
}

describe('ScientificCalculator basic operations', () => {
  let calc

  beforeEach(() => {
    setupDOM()
    calc = new ScientificCalculator()
  })

  test('adds two numbers correctly', () => {
    calc.previousValue = '2'
    calc.currentValue = '3'
    calc.operation = 'add'
    expect(calc.performOperation()).toBe(5)
  })

  test('division by zero throws error', () => {
    calc.previousValue = '5'
    calc.currentValue = '0'
    calc.operation = 'divide'
    expect(() => calc.performOperation()).toThrow('No se puede dividir por cero')
  })

  test('sin function (degrees) approximates expected value', () => {
    calc.currentValue = '30'
    calc.handleFunction('sin')
    const value = Number.parseFloat(calc.currentValue)
    expect(value).toBeGreaterThan(0.49)
    expect(value).toBeLessThan(0.51)
  })

  test('roundResult reduces floating point noise', () => {
    // con aritmética precisa 0.1 + 0.2 debe dar exactamente 0.3
    calc.previousValue = '0.1'
    calc.currentValue = '0.2'
    calc.operation = 'add'
    const result = calc.performOperation()
    expect(result).toBe(0.3)
  })

  test('history limits to 10 entries', () => {
    for (let i = 0; i < 12; i++) {
      calc.addToHistory(`op${i}`, i)
    }
    expect(calc.history.length).toBe(10)
    expect(calc.history[0].expression).toBe('op11')
    expect(calc.history[9].expression).toBe('op2')
  })
})
