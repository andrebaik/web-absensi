import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { mahasiswaDB, dosenDB, mataKuliahDB, ruanganDB, jadwalDB, absensiDB } from '../../data/mockDatabase';
import { GraduationCap, Users, BookOpen, Building2, Calendar, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ mhs: 0, dosen: 0, mk: 0, ruangan: 0, jadwal: 0, absensi: 0 });

  useEffect(() => {
    setStats({
      mhs: mahasiswaDB.getAll().length,
      dosen: dosenDB.getAll().length,
      mk: mataKuliahDB.getAll().length,
      ruangan: ruanganDB.getAll().length,
      jadwal: jadwalDB.getAll().length,
      absensi: absensiDB.getAll().length,
    });
  }, []);

  const quickLinks = [
    { to: '/admin/mahasiswa', label: 'Kelola Mahasiswa', desc: 'Tambah, edit, hapus data mahasiswa', icon: GraduationCap },
    { to: '/admin/dosen', label: 'Kelola Dosen', desc: 'Manajemen data dosen', icon: Users },
    { to: '/admin/mata-kuliah', label: 'Mata Kuliah', desc: 'Kelola data mata kuliah', icon: BookOpen },
    { to: '/admin/ruangan', label: 'Ruangan', desc: 'Manajemen ruang perkuliahan', icon: Building2 },
    { to: '/admin/jadwal', label: 'Jadwal Kuliah', desc: 'Atur jadwal perkuliahan', icon: Calendar },
    { to: '/admin/absensi', label: 'Data Absensi', desc: 'Kelola & edit absensi mahasiswa', icon: ClipboardList },
  ];

  return (
    <DashboardLayout title="Dashboard Admin">
      <div className="page-header">
        <div>
          <h2>Dashboard Administrator</h2>
          <p>Selamat datang di ASINETKW – Sistem Absensi & Manajemen Kampus</p>
        </div>
      </div>
      <div className="stats-grid">
        <StatCard icon={GraduationCap} label="Total Mahasiswa" value={stats.mhs} color="blue" />
        <StatCard icon={Users} label="Total Dosen" value={stats.dosen} color="green" />
        <StatCard icon={BookOpen} label="Mata Kuliah" value={stats.mk} color="yellow" />
        <StatCard icon={Building2} label="Ruangan" value={stats.ruangan} color="purple" />
        <StatCard icon={Calendar} label="Jadwal Kuliah" value={stats.jadwal} color="teal" />
        <StatCard icon={ClipboardList} label="Data Absensi" value={stats.absensi} color="red" />
      </div>
      <div className="card">
        <div className="card-header"><h3 className="card-title">Menu Cepat</h3></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {quickLinks.map(l => (
            <Link key={l.to} to={l.to} style={{ textDecoration: 'none' }}>
              <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 14 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f0f7ff'; e.currentTarget.style.borderColor = '#2563eb'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', flexShrink: 0 }}>
                  <l.icon size={18} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{l.label}</p>
                  <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{l.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
