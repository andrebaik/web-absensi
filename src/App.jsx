import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { initDB } from './data/mockDatabase';
import ProtectedRoute from './components/common/ProtectedRoute';
import ClickSpark from './components/common/ClickSpark';
import { ThemeProvider } from './context/ThemeContext';

import LoginPage from './pages/auth/LoginPage';

import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AccessDeniedPage from './pages/AccessDeniedPage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import MahasiswaPage from './pages/admin/MahasiswaPage';
import DosenPage from './pages/admin/DosenPage';
import MataKuliahPage from './pages/admin/MataKuliahPage';
import RuanganPage from './pages/admin/RuanganPage';
import JadwalPage from './pages/admin/JadwalPage';
import AbsensiPage from './pages/admin/AbsensiPage';
import RekapAbsensiPage from './pages/admin/RekapAbsensiPage';
import HakAksesPage from './pages/admin/HakAksesPage';
import BackupPage from './pages/admin/BackupPage';

// Dosen
import DosenDashboard from './pages/dosen/DosenDashboard';
import DosenJadwalPage from './pages/dosen/DosenJadwalPage';
import DosenMahasiswaPage from './pages/dosen/DosenMahasiswaPage';
import DosenAbsensiPage from './pages/dosen/DosenAbsensiPage';
import DosenRekapPage from './pages/dosen/DosenRekapPage';

// Mahasiswa
import MahasiswaDashboard from './pages/mahasiswa/MahasiswaDashboard';
import MahasiswaAbsensiPage from './pages/mahasiswa/MahasiswaAbsensiPage';
import MahasiswaRekapPage from './pages/mahasiswa/MahasiswaRekapPage';



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ThemeProvider>
            <ClickSpark sparkColor="#ffffff" sparkSize={10} sparkRadius={15} sparkCount={10} duration={500}>
              <Routes>
                {/* Public */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/akses-ditolak" element={
              <ProtectedRoute><AccessDeniedPage /></ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/mahasiswa" element={<ProtectedRoute allowedRoles={['admin']}><MahasiswaPage /></ProtectedRoute>} />
            <Route path="/admin/dosen" element={<ProtectedRoute allowedRoles={['admin']}><DosenPage /></ProtectedRoute>} />
            <Route path="/admin/mata-kuliah" element={<ProtectedRoute allowedRoles={['admin']}><MataKuliahPage /></ProtectedRoute>} />
            <Route path="/admin/ruangan" element={<ProtectedRoute allowedRoles={['admin']}><RuanganPage /></ProtectedRoute>} />
            <Route path="/admin/jadwal" element={<ProtectedRoute allowedRoles={['admin']}><JadwalPage /></ProtectedRoute>} />
            <Route path="/admin/absensi" element={<ProtectedRoute allowedRoles={['admin']}><AbsensiPage /></ProtectedRoute>} />
            <Route path="/admin/rekap" element={<ProtectedRoute allowedRoles={['admin']}><RekapAbsensiPage /></ProtectedRoute>} />
            <Route path="/admin/hak-akses" element={<ProtectedRoute allowedRoles={['admin']}><HakAksesPage /></ProtectedRoute>} />
            <Route path="/admin/backup" element={<ProtectedRoute allowedRoles={['admin']}><BackupPage /></ProtectedRoute>} />

            {/* Dosen */}
            <Route path="/dosen" element={<ProtectedRoute allowedRoles={['dosen']}><DosenDashboard /></ProtectedRoute>} />
            <Route path="/dosen/jadwal" element={<ProtectedRoute allowedRoles={['dosen']}><DosenJadwalPage /></ProtectedRoute>} />
            <Route path="/dosen/mahasiswa" element={<ProtectedRoute allowedRoles={['dosen']}><DosenMahasiswaPage /></ProtectedRoute>} />
            <Route path="/dosen/absensi" element={<ProtectedRoute allowedRoles={['dosen']}><DosenAbsensiPage /></ProtectedRoute>} />
            <Route path="/dosen/rekap" element={<ProtectedRoute allowedRoles={['dosen']}><DosenRekapPage /></ProtectedRoute>} />

            {/* Mahasiswa */}
            <Route path="/mahasiswa" element={<ProtectedRoute allowedRoles={['mahasiswa']}><MahasiswaDashboard /></ProtectedRoute>} />
            <Route path="/mahasiswa/absensi" element={<ProtectedRoute allowedRoles={['mahasiswa']}><MahasiswaAbsensiPage /></ProtectedRoute>} />
            <Route path="/mahasiswa/rekap" element={<ProtectedRoute allowedRoles={['mahasiswa']}><MahasiswaRekapPage /></ProtectedRoute>} />
            <Route path="/mahasiswa/jadwal" element={<ProtectedRoute allowedRoles={['mahasiswa']}><MahasiswaDashboard /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </ClickSpark>
          </ThemeProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
