import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Gallery } from './pages/Gallery';
import { DetailPage } from './pages/DetailPage';
import { PhotoWall } from './pages/PhotoWall';
import { Login } from './pages/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { BookEditor } from './pages/admin/BookEditor';
import { Profile } from './pages/admin/Profile';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/photowall" element={<PhotoWall />} />
              <Route path="/book/:id" element={<DetailPage />} />

              {/* Admin Auth */}
              <Route path="/admin/login" element={<Login />} />

              {/* Admin Dashboard Routes */}
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/book/new" element={<BookEditor />} />
              <Route path="/admin/profile" element={<Profile />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;