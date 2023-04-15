// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  PokemonDataView,
  PokemonErrorBoundary,
  PokemonForm,
  PokemonInfoFallback,
  fetchPokemon,
} from '../pokemon'

// 🐨 this is going to be our generic asyncReducer
function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      // 🐨 replace "pokemon" with "data" (in the action too!)
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const useAsync = initialState => {
  const [state, dispatch] = React.useReducer(asyncReducer, initialState)
  const mounted = React.useRef(false)

  const unsafeDispatch = React.useCallback(
    (...args) => {
      if (mounted.current) {
        dispatch(...args)
      }
    },
    [dispatch],
  )

  React.useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const run = React.useCallback(promise => {
    unsafeDispatch({type: 'pending'})
    promise
      .then(data => {
        unsafeDispatch({type: 'resolved', data})
      })
      .catch(error => {
        unsafeDispatch({type: 'rejected', error})
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // React.useEffect(() => {
  //   const promise = asyncCallback()
  //   if (!promise) {
  //     return
  //   }

  //   dispatch({type: 'pending'})
  //   promise.then(
  //     data => {
  //       dispatch({type: 'resolved', data})
  //     },
  //     error => {
  //       dispatch({type: 'rejected', error})
  //     },
  //   )
  // }, [asyncCallback])

  return {...state, run}
}

function PokemonInfo({pokemonName}) {
  // const asyncCallback = React.useCallback(() => {
  //   if (!pokemonName) {
  //     return
  //   }
  //   return fetchPokemon(pokemonName)
  // }, [pokemonName])

  const {data, status, error, run} = useAsync({
    status: pokemonName ? 'pending' : 'idle',
    data: null,
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    run(fetchPokemon(pokemonName))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemonName, run])

  // const {data, status, error} = state

  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={data} />
    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
