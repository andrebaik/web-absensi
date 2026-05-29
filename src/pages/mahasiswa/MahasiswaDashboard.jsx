import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

import { Calendar, ClipboardList, BarChart2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MahasiswaDashboard() {
  const { profile } = useAuth();
  const [jadwalList, setJadwalList] = useState([]);
  const [rekap, setRekap] = useState({ hadir: 0, total: 0, pct: 0 });

  useEffect(() => {
    if (!profile) return;

    let isMounted = true;

    const load = async () => {
      try {
        const [
          mataKuliah,
          ruangan,
          jadwal,
          absensi,
        ] = await Promise.all([
          api.get('/mata-kuliah'),
          api.get('/ruangan'),
          api.get(`/jadwal?kelas=${encodeURIComponent(profile.kelas)}`),
          api.get('/absensi'),
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

        const jadwalKelas = Array.isArray(jadwal) ? jadwal : [];

        const enriched = jadwalKelas.map(j => ({
          ...j,
          mk_nama: mkById?.[j.mata_kuliah_id]?.nama_mk || '-',
          ruangan_nama: ruangById?.[j.ruangan_id]?.nama_ruangan || '-',
        }));

        const jadwalIds = new Set(enriched.map(j => j.id));
        const absMhs = (Array.isArray(absensi) ? absensi : []).filter(
          a => String(a.mahasiswa_id) === String(profile.id) && jadwalIds.has(a.jadwal_id)
        );

        const hadir = absMhs.filter(a => a.status_absensi === 'Hadir').length;
        const total = absMhs.length;
        const pct = total ? Math.round((hadir / total) * 100) : 0;

        setJadwalList(enriched);
        setRekap({ hadir, total, pct });
      } catch (err) {
        console.error('Gagal memuat dashboard mahasiswa:', err);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [profile]);


  const barColor = p => p >= 75 ? '#10b981' : p >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <DashboardLayout title="Dashboard Mahasiswa">
      <div className="page-header">
        <div><h2>Dashboard Mahasiswa</h2><p>Selamat datang, {profile?.nama}</p></div>
        <Link to="/mahasiswa/absensi" className="btn btn-primary"><ClipboardList size={15} /> Input Absensi</Link>
      </div>

      <div className="stats-grid">
        <StatCard icon={Calendar} label="Jadwal Kuliah" value={jadwalList.length} color="blue" />
        <StatCard icon={ClipboardList} label="Total Absensi" value={rekap.total} color="yellow" />
        <StatCard icon={CheckCircle} label="Jumlah Hadir" value={rekap.hadir} color="green" />
        <StatCard icon={BarChart2} label="% Kehadiran" value={`${rekap.pct}%`} color="purple" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header"><h3 className="card-title">Jadwal Kuliah</h3></div>
          {jadwalList.length === 0 ? <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Tidak ada jadwal</p>
            : <div className="jadwal-grid">
              {jadwalList.map(j => (
                <div key={j.id} className="jadwal-card">
                  <h4>{j.mk_nama}</h4>
                  <div className="detail">
                    <div className="detail-row"><strong>Hari</strong> {j.hari}</div>
                    <div className="detail-row"><strong>Jam</strong> {j.jam_mulai} – {j.jam_selesai}</div>
                    <div className="detail-row"><strong>Ruang</strong> {j.ruangan_nama}</div>
                  </div>
                </div>
              ))}
            </div>}
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">Ringkasan Kehadiran</h3></div>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: barColor(rekap.pct) }}>{rekap.pct}%</div>
            <p style={{ color: '#64748b', margin: '8px 0 16px' }}>Persentase Kehadiran</p>
            <div className="progress-bar" style={{ height: 12, margin: '0 auto 16px', maxWidth: 240 }}>
              <div className="progress-fill" style={{ width: `${rekap.pct}%`, background: barColor(rekap.pct) }} />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{rekap.hadir} hadir dari {rekap.total} pertemuan</p>
            {rekap.pct < 75 && rekap.total > 0 && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, fontSize: '0.82rem', color: '#ef4444' }}>
                ⚠️ Kehadiran di bawah 75%. Harap perhatikan kehadiran Anda!
              </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8 }}>
            <Link to="/mahasiswa/absensi" className="btn btn-primary btn-sm">Input Absensi</Link>
            <Link to="/mahasiswa/rekap" className="btn btn-outline btn-sm">Lihat Rekap</Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
