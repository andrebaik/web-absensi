import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { jadwalDB, mataKuliahDB, ruanganDB, absensiDB } from '../../data/mockDatabase';
import { Calendar, ClipboardList, BarChart2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MahasiswaDashboard() {
  const { profile } = useAuth();
  const [jadwalList, setJadwalList] = useState([]);
  const [rekap, setRekap] = useState({ hadir: 0, total: 0, pct: 0 });

  useEffect(() => {
    if (!profile) return;
    const mks = mataKuliahDB.getAll();
    const ruangans = ruanganDB.getAll();
    const jadwal = jadwalDB.getByKelas(profile.kelas);
    setJadwalList(jadwal.map(j => ({ ...j, mk_nama: mks.find(m => m.id === j.mata_kuliah_id)?.nama_mk || '-', ruangan_nama: ruangans.find(r => r.id === j.ruangan_id)?.nama_ruangan || '-' })));
    const abs = absensiDB.getByMahasiswa(profile.id);
    const hadir = abs.filter(a => a.status_absensi === 'Hadir').length;
    setRekap({ hadir, total: abs.length, pct: abs.length ? Math.round((hadir / abs.length) * 100) : 0 });
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
