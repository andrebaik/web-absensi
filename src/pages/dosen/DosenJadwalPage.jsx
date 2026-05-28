import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { jadwalDB, mataKuliahDB, ruanganDB } from '../../data/mockDatabase';

export default function DosenJadwalPage() {
  const { profile } = useAuth();
  const [jadwalList, setJadwalList] = useState([]);

  useEffect(() => {
    if (!profile) return;
    const mks = mataKuliahDB.getAll();
    const ruangans = ruanganDB.getAll();
    const jadwal = jadwalDB.getByDosen(profile.id);
    setJadwalList(jadwal.map(j => ({
      ...j,
      mk_nama: mks.find(m => m.id === j.mata_kuliah_id)?.nama_mk || '-',
      ruangan_nama: ruangans.find(r => r.id === j.ruangan_id)?.nama_ruangan || '-',
    })));
  }, [profile]);

  const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  return (
    <DashboardLayout title="Jadwal Mengajar">
      <div className="page-header">
        <div><h2>Jadwal Mengajar</h2><p>Daftar jadwal mata kuliah yang Anda ampu</p></div>
      </div>
      {jadwalList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: '#94a3b8' }}>Tidak ada jadwal mengajar</p>
        </div>
      ) : HARI.map(hari => {
        const items = jadwalList.filter(j => j.hari === hari);
        if (!items.length) return null;
        return (
          <div key={hari} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{hari}</h3>
            <div className="jadwal-grid">
              {items.map(j => (
                <div key={j.id} className="jadwal-card">
                  <h4>{j.mk_nama}</h4>
                  <span className="badge badge-blue" style={{ marginTop: 4 }}>{j.kelas}</span>
                  <div className="detail">
                    <div className="detail-row"><strong>Jam</strong> {j.jam_mulai} – {j.jam_selesai}</div>
                    <div className="detail-row"><strong>Ruangan</strong> {j.ruangan_nama}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </DashboardLayout>
  );
}
