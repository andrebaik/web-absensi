import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { api } from '../../api/client';
import { GraduationCap, Users, BookOpen, Building2, Calendar, ClipboardList } from 'lucide-react';

import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ mhs: 0, dosen: 0, mk: 0, ruangan: 0, jadwal: 0, absensi: 0 });

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const [
          mahasiswa,
          dosen,
          mataKuliah,
          ruangan,
          jadwal,
          rekapAdmin,
        ] = await Promise.all([
          api.get('/mahasiswa'),
          api.get('/dosen'),
          api.get('/mata-kuliah'),
          api.get('/ruangan'),
          api.get('/jadwal'),
          api.get('/absensi/rekap/admin'),
        ]);

        if (!isMounted) return;

        const totalAbsensi = Array.isArray(rekapAdmin)
          ? rekapAdmin.reduce((sum, r) => sum + (Number(r.total) || 0), 0)
          : 0;

        setStats({
          mhs: Array.isArray(mahasiswa) ? mahasiswa.length : 0,
          dosen: Array.isArray(dosen) ? dosen.length : 0,
          mk: Array.isArray(mataKuliah) ? mataKuliah.length : 0,
          ruangan: Array.isArray(ruangan) ? ruangan.length : 0,
          jadwal: Array.isArray(jadwal) ? jadwal.length : 0,
          absensi: totalAbsensi,
        });
      } catch (err) {
        console.error('Gagal mengambil statistik dashboard:', err);
      }
    };

    loadStats();
    return () => {
      isMounted = false;
    };
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
