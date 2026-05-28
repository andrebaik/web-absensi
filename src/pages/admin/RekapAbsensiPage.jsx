import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { absensiDB, mahasiswaDB, jadwalDB, mataKuliahDB } from '../../data/mockDatabase';

export default function RekapAbsensiPage() {
  const [rekap, setRekap] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const mhsList = mahasiswaDB.getAll();
    const jadwalList = jadwalDB.getAll();
    const mkList = mataKuliahDB.getAll();
    const absensi = absensiDB.getAll();

    const rows = [];
    mhsList.forEach(mhs => {
      const absMhs = absensi.filter(a => a.mahasiswa_id === mhs.id);
      const grouped = {};
      absMhs.forEach(a => {
        const jadwal = jadwalList.find(j => j.id === a.jadwal_id);
        if (!jadwal) return;
        const mk = mkList.find(m => m.id === jadwal.mata_kuliah_id);
        const key = `${mhs.id}_${jadwal.mata_kuliah_id}`;
        if (!grouped[key]) grouped[key] = { mhs_nama: mhs.nama, mhs_nim: mhs.nim, mk_nama: mk?.nama_mk || '-', hadir: 0, izin: 0, sakit: 0, alpha: 0, total: 0 };
        grouped[key][a.status_absensi.toLowerCase()]++;
        grouped[key].total++;
      });
      rows.push(...Object.values(grouped));
    });
    setRekap(rows);
  }, []);

  const filtered = filter ? rekap.filter(r => r.mhs_nama.toLowerCase().includes(filter.toLowerCase()) || r.mhs_nim.includes(filter) || r.mk_nama.toLowerCase().includes(filter.toLowerCase())) : rekap;

  function pct(r) { return r.total ? Math.round((r.hadir / r.total) * 100) : 0; }
  function barColor(p) { return p >= 75 ? '#10b981' : p >= 50 ? '#f59e0b' : '#ef4444'; }

  return (
    <DashboardLayout title="Rekap Absensi">
      <div className="page-header">
        <div><h2>Rekap Absensi</h2><p>Rekap kehadiran semua mahasiswa</p></div>
      </div>
      <div className="card">
        <div className="table-controls">
          <input className="search-input" placeholder="Cari mahasiswa / NIM / mata kuliah..." value={filter} onChange={e => setFilter(e.target.value)} />
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{filtered.length} data</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>No</th><th>NIM</th><th>Nama Mahasiswa</th><th>Mata Kuliah</th>
                <th>Hadir</th><th>Izin</th><th>Sakit</th><th>Alpha</th><th>Total</th><th>% Kehadiran</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="no-data">Tidak ada data rekap</td></tr>
              ) : filtered.map((r, i) => {
                const p = pct(r);
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{r.mhs_nim}</td>
                    <td>{r.mhs_nama}</td>
                    <td>{r.mk_nama}</td>
                    <td><span className="badge badge-success">{r.hadir}</span></td>
                    <td><span className="badge badge-blue">{r.izin}</span></td>
                    <td><span className="badge badge-warning">{r.sakit}</span></td>
                    <td><span className="badge badge-danger">{r.alpha}</span></td>
                    <td>{r.total}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 80 }}>
                          <div className="progress-fill" style={{ width: `${p}%`, background: barColor(p) }} />
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: barColor(p) }}>{p}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
