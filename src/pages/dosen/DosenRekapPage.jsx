import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { jadwalDB, mahasiswaDB, absensiDB, mataKuliahDB } from '../../data/mockDatabase';

export default function DosenRekapPage() {
  const { profile } = useAuth();
  const [rekap, setRekap] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!profile) return;
    const jadwal = jadwalDB.getByDosen(profile.id);
    const mks = mataKuliahDB.getAll();
    const mhsList = mahasiswaDB.getAll();
    const absensi = absensiDB.getAll();
    const rows = [];
    jadwal.forEach(j => {
      const mk = mks.find(m => m.id === j.mata_kuliah_id);
      const mhsInKelas = mhsList.filter(m => m.kelas === j.kelas);
      mhsInKelas.forEach(mhs => {
        const absMhs = absensi.filter(a => a.jadwal_id === j.id && a.mahasiswa_id === mhs.id);
        if (absMhs.length === 0) return;
        const h = absMhs.filter(a => a.status_absensi === 'Hadir').length;
        const iz = absMhs.filter(a => a.status_absensi === 'Izin').length;
        const sk = absMhs.filter(a => a.status_absensi === 'Sakit').length;
        const al = absMhs.filter(a => a.status_absensi === 'Alpha').length;
        const total = absMhs.length;
        rows.push({ nim: mhs.nim, nama: mhs.nama, mk_nama: mk?.nama_mk || '-', kelas: j.kelas, hadir: h, izin: iz, sakit: sk, alpha: al, total, pct: Math.round((h / total) * 100) });
      });
    });
    setRekap(rows);
  }, [profile]);

  const filtered = filter ? rekap.filter(r => r.nama.toLowerCase().includes(filter.toLowerCase()) || r.nim.includes(filter) || r.mk_nama.toLowerCase().includes(filter.toLowerCase())) : rekap;
  const barColor = p => p >= 75 ? '#10b981' : p >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <DashboardLayout title="Rekap Absensi">
      <div className="page-header">
        <div><h2>Rekap Absensi Mahasiswa</h2><p>Rekap kehadiran mahasiswa di mata kuliah Anda</p></div>
      </div>
      <div className="card">
        <div className="table-controls">
          <input className="search-input" placeholder="Cari nama / NIM / mata kuliah..." value={filter} onChange={e => setFilter(e.target.value)} />
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{filtered.length} data</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>No</th><th>NIM</th><th>Nama</th><th>Mata Kuliah</th><th>Kelas</th><th>Hadir</th><th>Izin</th><th>Sakit</th><th>Alpha</th><th>% Hadir</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="no-data">Belum ada data absensi</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.nim}</td>
                  <td>{r.nama}</td>
                  <td>{r.mk_nama}</td>
                  <td><span className="badge badge-blue">{r.kelas}</span></td>
                  <td><span className="badge badge-success">{r.hadir}</span></td>
                  <td><span className="badge badge-blue">{r.izin}</span></td>
                  <td><span className="badge badge-warning">{r.sakit}</span></td>
                  <td><span className="badge badge-danger">{r.alpha}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ width: 70 }}>
                        <div className="progress-fill" style={{ width: `${r.pct}%`, background: barColor(r.pct) }} />
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: barColor(r.pct) }}>{r.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
