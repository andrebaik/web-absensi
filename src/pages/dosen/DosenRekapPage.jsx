import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';


export default function DosenRekapPage() {
  const { profile } = useAuth();
  const [rekap, setRekap] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!profile) return;

    (async () => {
      try {
        const rows = await api.get(`/absensi/rekap/dosen/${profile.id}`);

        const mapped = (Array.isArray(rows) ? rows : []).map(r => ({
          nim: String(r.mahasiswa_id ?? ''),
          nama: r.mahasiswa_nama || String(r.mahasiswa_id ?? ''),
          mk_nama: r.mata_kuliah || '-',
          kelas: r.kelas || '',
          hadir: r.hadir ?? 0,
          izin: r.izin ?? 0,
          sakit: r.sakit ?? 0,
          alpha: r.alpha ?? 0,
          total: r.total ?? 0,
          pct: r.persentase ?? (r.total ? Math.round(((r.hadir ?? 0) / (r.total ?? 1)) * 100) : 0),
        }));

        setRekap(mapped);
      } catch {
        setRekap([]);
      }
    })();
  }, [profile]);


  const filtered = filter
    ? rekap.filter(
        r =>
          (r.nama || '').toLowerCase().includes(filter.toLowerCase()) ||
          String(r.nim || '').includes(filter) ||
          (r.mk_nama || '').toLowerCase().includes(filter.toLowerCase())
      )
    : rekap;
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
