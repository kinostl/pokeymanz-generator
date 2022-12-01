import { h } from 'preact'
import { Router } from 'preact-router'

// Code-splitting is automated for `routes` directory
import Home from '../routes/home'
import baseroute from '../baseroute'

const App = () => (
  <div id='app'>
    <Router>
      <Home path={`${baseroute}/`} />
    </Router>
  </div>
)

export default App
