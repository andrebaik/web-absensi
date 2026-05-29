import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

import { Calendar, ClipboardList, Users, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DosenDashboard() {
  const { profile } = useAuth();
  const [jadwalList, setJadwalList] = useState([]);
  const [mkList, setMkList] = useState([]);
  const [stats, setStats] = useState({ jadwal: 0, absensi: 0, mahasiswa: 0 });

  useEffect(() => {
    if (!profile) return;

    let isMounted = true;
    const load = async () => {
      try {
        const [
          jadwal,
          mahasiswa,
          mataKuliah,
          ruangan,
          absensi
        ] = await Promise.all([
          api.get(`/jadwal/dosen/${profile.id}`),
          api.get('/mahasiswa'),
          api.get('/mata-kuliah'),
          api.get('/ruangan'),
          api.get(`/absensi/rekap/dosen/${profile.id}`)
        ]);


        if (!isMounted) return;

        const ruangById = (Array.isArray(ruangan) ? ruangan : []).reduce((acc, r) => {
          acc[r.id] = r;
          return acc;
        }, {});

        const mkById = (Array.isArray(mataKuliah) ? mataKuliah : []).reduce((acc, m) => {
          acc[m.id] = m;
          return acc;
        }, {});

        const enriched = (Array.isArray(jadwal) ? jadwal : []).map(j => ({
          ...j,
          mk_nama: mkById?.[j.mata_kuliah_id]?.nama_mk || '-',
          ruangan_nama: ruangById?.[j.ruangan_id]?.nama_ruangan || '-',
        }));

        setJadwalList(enriched);
        setMkList(Array.isArray(mataKuliah) ? mataKuliah : []);

        const kelas = [...new Set(enriched.map(j => j.kelas))];
        const mhsCount = (Array.isArray(mahasiswa) ? mahasiswa : []).filter(m => kelas.includes(m.kelas)).length;

        const rekap = Array.isArray(absensi) ? absensi : [];
        const totalAbsensi = rekap.reduce((sum, r) => sum + (Number(r.total) || 0), 0);

        setStats({ jadwal: enriched.length, absensi: totalAbsensi, mahasiswa: mhsCount });

      } catch (err) {
        console.error('Gagal memuat dashboard dosen:', err);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [profile]);


  const quickLinks = [
    { to: '/dosen/jadwal', label: 'Jadwal Mengajar', icon: Calendar },
    { to: '/dosen/mahasiswa', label: 'Data Mahasiswa', icon: Users },
    { to: '/dosen/absensi', label: 'Input Absensi', icon: ClipboardList },
    { to: '/dosen/rekap', label: 'Rekap Absensi', icon: BarChart2 },
  ];

  return (
    <DashboardLayout title="Dashboard Dosen">
      <div className="page-header">
        <div>
          <h2>Dashboard Dosen</h2>
          <p>Selamat datang, {profile?.nama || 'Dosen'}</p>
        </div>
      </div>
      <div className="stats-grid">
        <StatCard icon={Calendar} label="Jadwal Mengajar" value={stats.jadwal} color="blue" />
        <StatCard icon={Users} label="Total Mahasiswa" value={stats.mahasiswa} color="green" />
        <StatCard icon={ClipboardList} label="Data Absensi" value={stats.absensi} color="yellow" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header"><h3 className="card-title">Jadwal Mengajar Hari Ini</h3></div>
          <div className="jadwal-grid">
            {jadwalList.length === 0 ? <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Tidak ada jadwal</p>
              : jadwalList.map(j => (
              <div key={j.id} className="jadwal-card">
                <h4>{j.mk_nama}</h4>
                <span className="badge badge-blue">{j.kelas}</span>
                <div className="detail">
                  <div className="detail-row"><strong>Hari</strong> {j.hari}</div>
                  <div className="detail-row"><strong>Jam</strong> {j.jam_mulai} – {j.jam_selesai}</div>
                  <div className="detail-row"><strong>Ruang</strong> {j.ruangan_nama}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3 className="card-title">Akses Cepat</h3></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {quickLinks.map(l => (
              <Link key={l.to} to={l.to} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', textDecoration: 'none', color: '#1e293b', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f0f7ff'; e.currentTarget.style.borderColor = '#2563eb'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                <l.icon size={18} style={{ color: '#2563eb' }} />
                <span style={{ fontWeight: 500, fontSize: '0.88rem' }}>{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
