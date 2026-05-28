import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Prism from '../common/Prism';
import {
  LayoutDashboard, Users, BookOpen, Calendar, ClipboardList,
  BarChart2, Shield, Database, Home, GraduationCap, ChevronRight,
  LogOut, Menu, X, Building2, UserCog
} from 'lucide-react';

const adminNav = [
  { section: 'Dashboard', items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard }] },
  { section: 'Akademik', items: [
    { to: '/admin/mahasiswa', label: 'Data Mahasiswa', icon: GraduationCap },
    { to: '/admin/dosen', label: 'Data Dosen', icon: Users },
    { to: '/admin/mata-kuliah', label: 'Mata Kuliah', icon: BookOpen },
    { to: '/admin/ruangan', label: 'Ruangan', icon: Building2 },
    { to: '/admin/jadwal', label: 'Jadwal Kuliah', icon: Calendar },
  ]},
  { section: 'Absensi', items: [
    { to: '/admin/absensi', label: 'Data Absensi', icon: ClipboardList },
    { to: '/admin/rekap', label: 'Rekap Absensi', icon: BarChart2 },
  ]},
  { section: 'Sistem', items: [
    { to: '/admin/hak-akses', label: 'Hak Akses', icon: Shield },
    { to: '/admin/backup', label: 'Backup Data', icon: Database },
  ]},
];

const dosenNav = [
  { section: 'Dashboard', items: [{ to: '/dosen', label: 'Dashboard', icon: LayoutDashboard }] },
  { section: 'Akademik', items: [
    { to: '/dosen/jadwal', label: 'Jadwal Mengajar', icon: Calendar },
    { to: '/dosen/mahasiswa', label: 'Data Mahasiswa', icon: GraduationCap },
  ]},
  { section: 'Absensi', items: [
    { to: '/dosen/absensi', label: 'Input Absensi', icon: ClipboardList },
    { to: '/dosen/rekap', label: 'Rekap Absensi', icon: BarChart2 },
  ]},
];

const mahasiswaNav = [
  { section: 'Dashboard', items: [{ to: '/mahasiswa', label: 'Dashboard', icon: LayoutDashboard }] },
  { section: 'Perkuliahan', items: [
    { to: '/mahasiswa/jadwal', label: 'Jadwal Kuliah', icon: Calendar },
    { to: '/mahasiswa/absensi', label: 'Input Absensi', icon: ClipboardList },
    { to: '/mahasiswa/rekap', label: 'Rekap Absensi', icon: BarChart2 },
  ]},
];

export default function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navMap = { admin: adminNav, dosen: dosenNav, mahasiswa: mahasiswaNav };
  const nav = navMap[user?.role] || [];
  const roleLabel = { admin: 'Administrator', dosen: 'Dosen', mahasiswa: 'Mahasiswa' };

  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [logoutKeyword, setLogoutKeyword] = useState('');

  function handleRequestLogout() {
    setLogoutKeyword('');
    setConfirmLogoutOpen(true);
  }

  function handleConfirmLogout() {
    if (logoutKeyword !== 'KELUAR') return;
    setConfirmLogoutOpen(false);
    logout();
    navigate('/login');
  }


  const avatar = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="layout">
      {/* Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? '' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>ASINETKW</h1>
          <span>Sistem Manajemen Kampus</span>
        </div>
        <div className="sidebar-role">
          <p>Login sebagai</p>
          <strong>{roleLabel[user?.role]}</strong>
        </div>
        <nav className="sidebar-nav">
          {nav.map(section => (
            <div key={section.section}>
              <div className="nav-section">{section.section}</div>
              {section.items.map(item => (
                <NavLink key={item.to} to={item.to} end={item.to.split('/').length <= 2}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}>
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleRequestLogout} style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={15} /> Keluar
          </button>

          {confirmLogoutOpen && (
            <div className="confirm-overlay">
              <div className="confirm-box">
                <div className="confirm-icon">⚠️</div>
                <h4>Logout?</h4>
                <p>Untuk melanjutkan, ketik <strong>KELUAR</strong> lalu klik “Konfirmasi”.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                  <input
                    className="form-control"
                    value={logoutKeyword}
                    onChange={(e) => setLogoutKeyword(e.target.value)}
                    placeholder="KELUAR"
                    autoComplete="off"
                    autoFocus
                    style={{ textAlign: 'center' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConfirmLogout();
                    }}
                  />
                </div>

                <div className="confirm-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setConfirmLogoutOpen(false);
                      setLogoutKeyword('');
                    }}
                  >
                    Batal
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleConfirmLogout}
                    style={{ opacity: logoutKeyword === 'KELUAR' ? 1 : 0.6, pointerEvents: logoutKeyword === 'KELUAR' ? 'auto' : 'none' }}
                  >
                    Konfirmasi
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="navbar">
          <div className="navbar-left">
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span className="navbar-title">{title}</span>
          </div>
          <div className="navbar-right">
            <div className="navbar-user">
              <div className="navbar-avatar">{avatar}</div>
              <div className="navbar-info">
                <p>{user?.name}</p>
                <span>{roleLabel[user?.role]}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="page-body" style={{ position: 'relative' }}>
          {/* Prism background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0.35,
              zIndex: 0
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: 600 }}>
              <Prism animationType="hover" timeScale={0.5} height={3.5} baseWidth={5.5} scale={3.6} hueShift={0} colorFrequency={1} noise={0.5} glow={1} transparent />
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        </main>

      </div>
    </div>
  );
}
