import './App.css'
import {Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import { WastraContextProvider } from './context/WastraContextProvider'
import GalleryPage from './pages/GalleryPage'
import About from './pages/About'
import AISearchPage from './pages/AISearchPage'
import Contribution from './pages/Contribution'

function App() {
  return (
    <WastraContextProvider>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/gallery-page' element={<GalleryPage />} />
          <Route path='/ai-search' element={<AISearchPage />} />
          <Route path='/contribution' element={<Contribution />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </div>
    </WastraContextProvider>
  )
}

export default App
