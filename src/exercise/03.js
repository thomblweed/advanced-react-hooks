// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'

// 🐨 create your CountContext here with React.createContext

// 🐨 create a CountProvider component here that does this:
//   🐨 get the count state and setCount updater with React.useState
//   🐨 create a `value` array with count and setCount
//   🐨 return your context provider with the value assigned to that array and forward all the other props
//   💰 more specifically, we need the children prop forwarded to the context provider

const CountContext = React.createContext()
const SetCountContext = React.createContext()

const CountProvider = ({children}) => {
  const [count, setCount] = React.useState(0)

  return (
    <SetCountContext.Provider value={setCount}>
      <CountContext.Provider value={count}>{children}</CountContext.Provider>
    </SetCountContext.Provider>
  )
}

const useCount = () => {
  const count = React.useContext(CountContext)
  React.useEffect(() => {
    if (isNaN(count)) {
      throw new Error('useCount must be used within a CountProvider')
    }
  }, [count])

  return count
}

const useSetCount = () => {
  const setCount = React.useContext(SetCountContext)

  React.useEffect(() => {
    if (typeof setCount !== 'function') {
      throw new Error('useSetCount must be used within a CountProvider')
    }
  }, [setCount])

  return setCount
}

function CountDisplay() {
  // 🐨 get the count from useContext with the CountContext
  const count = useCount()

  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  // 🐨 get the setCount from useContext with the CountContext
  const setCount = useSetCount()

  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {
  return (
    <div>
      {/*
        🐨 wrap these two components in the CountProvider so they can access
        the CountContext value
      */}
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  )
}

export default App
