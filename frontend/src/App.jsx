import { BrowserRouter, Route, Routes } from 'react-router'
import Signin from './pages/Signin'
import Login from './pages/Login'
import Home from './pages/Home'
import FileUpload from './pages/FileUpload'
import Sample from './pages/Sample'


const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signin />} />
      <Route path="/login" element={<Login />}/>
      <Route path="/file-upload" element={<FileUpload/>}/>
      <Route path="/sample" element={<Sample />}/>
    </Routes>
  </BrowserRouter>
)

export default App
