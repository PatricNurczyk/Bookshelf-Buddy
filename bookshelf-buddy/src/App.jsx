import { useState } from 'react'
import bBuddyLogo from '/logo.png'
import LoginButton from './LoginButton'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LoginButton></LoginButton>
      <div>
        <img src={bBuddyLogo} className="logo" alt="Vite logo" />
      </div>
      <h1>Bookshelf Buddy</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to reload the app
        </p>
      </div>
    </>
  )
}

export default App
