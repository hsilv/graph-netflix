import React, { useEffect, useMemo } from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import store from './store'
import Page from './pages'
import './App.scss'
import { StoreContext } from 'storeon/react'

function App() {
  return (
    <StoreContext.Provider value={store}>
      <Router>
      <div className="App">
        <Page />
      </div>
      </Router>
    </StoreContext.Provider>
  )
}

export default App
