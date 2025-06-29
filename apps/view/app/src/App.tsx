import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CardThemeProvider } from './contexts/CardThemeContext';
import { Toaster } from './components/ui/sonner';
import MainPage from './pages/MainPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CardThemeProvider>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </CardThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
