import { h } from 'preact'

// Code-splitting is automated for `routes` directory
import MoveSearch from './move-search'
const App = () => (
  <div id='app'>
    <MoveSearch />
  </div>
)

export default App
