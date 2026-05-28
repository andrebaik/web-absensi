import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { jadwalDB, mataKuliahDB, absensiDB } from '../../data/mockDatabase';
import { useToast } from '../../context/ToastContext';

const STATUS_LIST = ['Hadir', 'Izin', 'Sakit', 'Alpha'];

export default function MahasiswaAbsensiPage() {
  const { profile } = useAuth();
  const [jadwalList, setJadwalList] = useState([]);
  const [selectedJadwal, setSelectedJadwal] = useState('');
  const [pertemuan, setPertemuan] = useState(1);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('Hadir');
  const [keterangan, setKeterangan] = useState('');
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (!profile) return;
    const mks = mataKuliahDB.getAll();
    const jadwal = jadwalDB.getByKelas(profile.kelas);
    const enriched = jadwal.map(j => ({ ...j, mk_nama: mks.find(m => m.id === j.mata_kuliah_id)?.nama_mk || '-' }));
    setJadwalList(enriched);
    if (enriched.length > 0) setSelectedJadwal(String(enriched[0].id));
  }, [profile]);

  useEffect(() => {
    checkExisting();
  }, [selectedJadwal, pertemuan, profile]);

  function checkExisting() {
    if (!selectedJadwal || !profile) return;
    const existing = absensiDB.getByJadwalAndPertemuan(Number(selectedJadwal), Number(pertemuan));
    const myEntry = existing.find(a => a.mahasiswa_id === profile.id);
    if (myEntry) { setAlreadySubmitted(true); setStatus(myEntry.status_absensi); setKeterangan(myEntry.keterangan || ''); }
    else { setAlreadySubmitted(false); setStatus('Hadir'); setKeterangan(''); }
  }

  function handleSubmit() {
    if (!selectedJadwal || !profile) return;
    if (alreadySubmitted) { addToast('Absensi pertemuan ini sudah direkam', 'warning'); return; }
    absensiDB.create({ jadwal_id: Number(selectedJadwal), mahasiswa_id: profile.id, tanggal, pertemuan_ke: Number(pertemuan), status_absensi: status, keterangan });
    addToast('Absensi berhasil disimpan');
    setAlreadySubmitted(true);
  }

  return (
    <DashboardLayout title="Input Absensi">
      <div className="page-header">
        <div><h2>Input Absensi</h2><p>Rekam kehadiran Anda pada pertemuan kuliah</p></div>
      </div>
      <div className="card" style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Mata Kuliah</label>
            <select className="form-control" value={selectedJadwal}
              onChange={e => { setSelectedJadwal(e.target.value); setAlreadySubmitted(false); }}>
              {jadwalList.map(j => <option key={j.id} value={j.id}>{j.mk_nama} ({j.hari}, {j.jam_mulai})</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Pertemuan ke-</label>
              <input className="form-control" type="number" min={1} max={16} value={pertemuan}
                onChange={e => setPertemuan(e.target.value)} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Tanggal</label>
              <input className="form-control" type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 8 }}>Status Kehadiran</label>
            <div className="absensi-status">
              {STATUS_LIST.map(s => (
                <button key={s} disabled={alreadySubmitted}
                  className={`status-btn ${s.toLowerCase()} ${status === s ? 'selected' : ''}`}
                  onClick={() => setStatus(s)}>{s}</button>
              ))}
            </div>
          </div>
          {status !== 'Hadir' && (
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Keterangan</label>
              <textarea className="form-control" rows={3} value={keterangan} disabled={alreadySubmitted}
                onChange={e => setKeterangan(e.target.value)} placeholder="Tuliskan keterangan..." />
            </div>
          )}
          {alreadySubmitted ? (
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '12px 16px', color: '#059669', fontSize: '0.87rem' }}>
              ✓ Absensi pertemuan ini sudah terekam sebagai <strong>{status}</strong>. Hubungi dosen untuk perubahan.
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>
              Kirim Absensi
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
