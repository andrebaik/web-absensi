import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ShieldOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AccessDeniedPage() {
  const { user } = useAuth();
  const home = user?.role === 'admin' ? '/admin' : user?.role === 'dosen' ? '/dosen' : '/mahasiswa';

  return (
    <DashboardLayout title="Akses Ditolak">
      <div className="access-denied">
        <div className="icon"><ShieldOff size={64} color="#ef4444" /></div>
        <h2>Akses Ditolak</h2>
        <p>Anda tidak memiliki izin untuk mengakses halaman ini.<br />Hanya pengguna dengan role yang sesuai yang dapat melihat konten ini.</p>
        <Link to={home} className="btn btn-primary">Kembali ke Dashboard</Link>
      </div>
    </DashboardLayout>
  );
}
