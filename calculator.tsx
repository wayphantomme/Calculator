"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

const buttons = [
  'AC', '+/-', '%', '÷',
  '7', '8', '9', '×',
  '4', '5', '6', '-',
  '1', '2', '3', '+',
  '0', '.', '='
]

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [prevValue, setPrevValue] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const handleNumberInput = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
    setExpression(prev => prev + num)
  }

  const handleOperatorInput = (op: string) => {
    const inputValue = parseFloat(display)
    
    if (prevValue === null) {
      setPrevValue(inputValue)
    } else if (operator) {
      const result = performCalculation(prevValue, inputValue, operator)
      setPrevValue(result)
      setDisplay(String(result))
    }

    setWaitingForOperand(true)
    setOperator(op)
    setExpression(prev => `${prev} ${op} `)
  }

  const performCalculation = (a: number, b: number, op: string) => {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '×': return a * b
      case '÷': return a / b
      default: return b
    }
  }

  const handleEquals = () => {
    if (!operator || prevValue === null) return

    const inputValue = parseFloat(display)
    const result = performCalculation(prevValue, inputValue, operator)
    setDisplay(String(result))
    setExpression(`${prevValue} ${operator} ${inputValue} = ${result}`)
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(true)
  }

  const handleClear = () => {
    setDisplay('0')
    setExpression('')
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.')
      setExpression(prev => prev + '.')
    }
  }

  const handlePercentage = () => {
    const value = parseFloat(display)
    const result = value / 100
    setDisplay(String(result))
    setExpression(`${value}% = ${result}`)
  }

  const handleToggleSign = () => {
    const value = parseFloat(display)
    const result = -value
    setDisplay(String(result))
    setExpression(`-${value}`)
  }

  const handleButtonPress = (value: string) => {
    switch (value) {
      case 'AC': handleClear(); break
      case '+/-': handleToggleSign(); break
      case '%': handlePercentage(); break
      case '=': handleEquals(); break
      case '+':
      case '-':
      case '×':
      case '÷':
        handleOperatorInput(value); break
      case '.': handleDecimal(); break
      default: handleNumberInput(value)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-[375px] h-[812px] bg-black overflow-hidden flex flex-col">
        <div className="text-white text-3xl font-bold text-center py-6">
          Phantom Calculator
        </div>
        <div className="flex-grow flex flex-col justify-end p-6">
          <div className="text-right text-gray-400 text-2xl mb-2 h-8 flex items-center justify-end">
            {expression}
          </div>
          <div className="text-right text-white text-6xl font-light mb-4 h-20 flex items-center justify-end">
            {display}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 p-4">
          {buttons.map((btn) => (
            <motion.button
              key={btn}
              whileTap={{ scale: 0.95 }}
              className={`
                ${btn === '0' ? 'col-span-2' : ''}
                ${['÷', '×', '-', '+', '='].includes(btn) ? 'bg-orange-500 text-white' : 
                  ['AC', '+/-', '%'].includes(btn) ? 'bg-gray-300 text-black' : 'bg-gray-700 text-white'}
                h-[80px] rounded-full text-3xl font-medium focus:outline-none
              `}
              onClick={() => handleButtonPress(btn)}
            >
              {btn}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

