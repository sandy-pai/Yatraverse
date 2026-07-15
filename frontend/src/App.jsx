import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlaceDetails from './pages/PlaceDetails';
import Admin from './pages/Admin';
import AddPlace from './pages/AddPlace';
import EditPlace from './pages/EditPlace';
import './App.css';

function NotFound() {
  return (
    <main style={{ padding: '60px 32px', textAlign: 'center' }}>
      <h1>404 – Page Not Found</h1>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/places/:id"  element={<PlaceDetails />} />
        <Route path="/admin"       element={<Admin />} />
        <Route path="/admin/add"   element={<AddPlace />} />
        <Route path="/admin/edit/:id" element={<EditPlace />} />
        <Route path="*"            element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
