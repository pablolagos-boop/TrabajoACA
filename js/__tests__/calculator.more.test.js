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
    <button class="btn-number" data-value="1">1</button>
    <button class="btn-number" data-value="2">2</button>
    <button class="btn-operator" data-action="add">+</button>
    <button class="btn-operator" data-action="divide">÷</button>
    <button class="btn-function" data-action="log">log</button>
    <button class="btn-function" data-action="sqrt">√</button>
    <button class="btn-function" data-action="reciprocal">1/x</button>
    <button class="btn-memory" data-action="memory-add">M+</button>
    <button class="btn-memory" data-action="memory-recall">MR</button>
    <button class="btn-memory" data-action="memory-clear">MC</button>
  `
}

describe('ScientificCalculator additional tests', () => {
  let calc

  beforeEach(() => {
    setupDOM()
    calc = new ScientificCalculator()
  })

  test('log of positive number returns correct result', () => {
    calc.currentValue = '100'
    calc.handleFunction('log')
    const val = Number.parseFloat(calc.currentValue)
    expect(val).toBeCloseTo(2)
  })

  test('sqrt of negative triggers errorState and message', () => {
    calc.currentValue = '-9'
    calc.handleFunction('sqrt')
    expect(calc.errorState).toBe(true)
    expect(calc.expressionDisplay.textContent).toMatch(/raíz de un número negativo/i)
  })

  test('reciprocal of zero produces error message', () => {
    calc.currentValue = '0'
    calc.handleFunction('reciprocal')
    expect(calc.errorState).toBe(true)
    expect(calc.expressionDisplay.textContent).toMatch(/recíproco de cero/i)
  })

  test('memory add, recall and clear behave correctly', () => {
    calc.currentValue = '5'
    calc.handleMemory('memory-add')
    expect(calc.memory).toBe(5)

    calc.handleMemory('memory-add') // now 10
    expect(calc.memory).toBe(10)

    calc.handleMemory('memory-subtract') // subtract current (still 5)
    expect(calc.memory).toBe(5)

    calc.handleMemory('memory-recall')
    expect(calc.currentValue).toBe('5')

    calc.handleMemory('memory-clear')
    expect(calc.memory).toBe(0)
  })

  test('keyboard input produces correct calculation (1 + 2 = 3)', () => {
    // Simulate key presses: 1 + 2 Enter
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '+' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))

    // resultDisplay holds the result formatted
    expect(calc.resultDisplay.textContent).toBe('3')
  })

  test('formatNumber uses scientific notation for large numbers', () => {
    const formatted = calc.formatNumber('10000000000')
    expect(formatted).toMatch(/e\+|e-/i)
  })

  test('division normal case', () => {
    calc.previousValue = '6'
    calc.currentValue = '3'
    calc.operation = 'divide'
    expect(calc.performOperation()).toBe(2)
  })
})
