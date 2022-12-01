import './style'
import AppComponent from './components/app'
import { createContext } from 'preact'
import AppState from './appState'
import createAppState from './createAppState'

const App = () => (
  <AppState.Provider value={createAppState()}>
    <AppComponent />
  </AppState.Provider>
)
export default App
