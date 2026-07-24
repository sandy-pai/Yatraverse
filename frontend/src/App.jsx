import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlaceDetails from './pages/PlaceDetails';
import Admin from './pages/Admin';
import AddPlace from './pages/AddPlace';
import EditPlace from './pages/EditPlace';
import Login from './pages/Login';
import Signup from './pages/Signup';
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
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/places/:id" element={<PlaceDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add"
            element={
              <ProtectedRoute adminOnly>
                <AddPlace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <EditPlace />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}