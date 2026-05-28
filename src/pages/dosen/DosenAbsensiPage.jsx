import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { jadwalDB, mahasiswaDB, absensiDB, mataKuliahDB } from '../../data/mockDatabase';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import { Pencil } from 'lucide-react';

const STATUS_LIST = ['Hadir', 'Izin', 'Sakit', 'Alpha'];
const statusColor = s => ({ Hadir: 'badge-success', Izin: 'badge-blue', Sakit: 'badge-warning', Alpha: 'badge-danger' }[s] || 'badge-gray');

export default function DosenAbsensiPage() {
  const { profile } = useAuth();
  const [jadwalList, setJadwalList] = useState([]);
  const [mkList, setMkList] = useState([]);
  const [selectedJadwal, setSelectedJadwal] = useState('');
  const [pertemuan, setPertemuan] = useState(1);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [absensiMap, setAbsensiMap] = useState({});
  const [existingAbsensi, setExistingAbsensi] = useState([]);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ status_absensi: 'Hadir', keterangan: '' });
  const { addToast } = useToast();

  useEffect(() => {
    if (!profile) return;
    const mks = mataKuliahDB.getAll();
    setMkList(mks);
    const jadwal = jadwalDB.getByDosen(profile.id);
    setJadwalList(jadwal.map(j => ({ ...j, mk_nama: mks.find(m => m.id === j.mata_kuliah_id)?.nama_mk || '-' })));
    if (jadwal.length > 0) setSelectedJadwal(String(jadwal[0].id));
  }, [profile]);

  useEffect(() => {
    if (!selectedJadwal) return;
    const jId = Number(selectedJadwal);
    const jadwal = jadwalList.find(j => j.id === jId);
    if (!jadwal) return;
    const mhs = mahasiswaDB.getAll().filter(m => m.kelas === jadwal.kelas);
    setMahasiswaList(mhs);
    loadAbsensi(jId, pertemuan);
  }, [selectedJadwal, jadwalList]);

  function loadAbsensi(jadwalId, prt) {
    const existing = absensiDB.getByJadwalAndPertemuan(jadwalId, prt);
    setExistingAbsensi(existing);
    const map = {};
    existing.forEach(a => { map[a.mahasiswa_id] = { status: a.status_absensi, keterangan: a.keterangan }; });
    setAbsensiMap(map);
  }

  function handleChangeStatus(mhsId, status) {
    setAbsensiMap(prev => ({ ...prev, [mhsId]: { ...prev[mhsId], status, keterangan: prev[mhsId]?.keterangan || '' } }));
  }

  function handleSave() {
    const jId = Number(selectedJadwal);
    mahasiswaList.forEach(mhs => {
      const s = absensiMap[mhs.id]?.status || 'Alpha';
      const ket = absensiMap[mhs.id]?.keterangan || '';
      const existing = existingAbsensi.find(a => a.mahasiswa_id === mhs.id);
      if (existing) {
        absensiDB.update(existing.id, { status_absensi: s, keterangan: ket });
      } else {
        absensiDB.create({ jadwal_id: jId, mahasiswa_id: mhs.id, tanggal, pertemuan_ke: Number(pertemuan), status_absensi: s, keterangan: ket });
      }
    });
    addToast('Absensi berhasil disimpan');
    loadAbsensi(jId, Number(pertemuan));
  }

  function openEdit(mhsId) {
    const cur = absensiMap[mhsId] || { status: 'Alpha', keterangan: '' };
    setEditForm({ status_absensi: cur.status || 'Alpha', keterangan: cur.keterangan || '' });
    setEditModal(mhsId);
  }

  function handleEditSave() {
    const mhsId = editModal;
    setAbsensiMap(prev => ({ ...prev, [mhsId]: { status: editForm.status_absensi, keterangan: editForm.keterangan } }));
    const existing = existingAbsensi.find(a => a.mahasiswa_id === mhsId);
    if (existing) absensiDB.update(existing.id, { status_absensi: editForm.status_absensi, keterangan: editForm.keterangan });
    setEditModal(null);
    addToast('Absensi diperbarui');
  }

  return (
    <DashboardLayout title="Input Absensi">
      <div className="page-header">
        <div><h2>Input & Edit Absensi</h2><p>Rekam kehadiran mahasiswa per pertemuan</p></div>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 14 }}>
          <div className="form-group">
            <label style={{ fontSize: '0.82rem', fontWeight: 500 }}>Mata Kuliah / Jadwal</label>
            <select className="form-control" value={selectedJadwal} onChange={e => { setSelectedJadwal(e.target.value); loadAbsensi(Number(e.target.value), pertemuan); }}>
              {jadwalList.map(j => <option key={j.id} value={j.id}>{j.mk_nama} ({j.kelas})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.82rem', fontWeight: 500 }}>Pertemuan ke-</label>
            <input className="form-control" type="number" min={1} max={16} value={pertemuan}
              onChange={e => { const p = Number(e.target.value); setPertemuan(p); loadAbsensi(Number(selectedJadwal), p); }} />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.82rem', fontWeight: 500 }}>Tanggal</label>
            <input className="form-control" type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} />
          </div>
        </div>
      </div>

      {mahasiswaList.length > 0 ? (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Daftar Hadir ({mahasiswaList.length} mahasiswa)</h3>
            <button className="btn btn-primary" onClick={handleSave}>Simpan Absensi</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>No</th><th>NIM</th><th>Nama</th><th>Status</th><th>Keterangan</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {mahasiswaList.map((mhs, i) => {
                  const cur = absensiMap[mhs.id] || {};
                  return (
                    <tr key={mhs.id}>
                      <td>{i + 1}</td>
                      <td>{mhs.nim}</td>
                      <td>{mhs.nama}</td>
                      <td>
                        <div className="absensi-status">
                          {STATUS_LIST.map(s => (
                            <button key={s} className={`status-btn ${s.toLowerCase()} ${cur.status === s ? 'selected' : ''}`}
                              onClick={() => handleChangeStatus(mhs.id, s)}>{s}</button>
                          ))}
                        </div>
                      </td>
                      <td>
                        {cur.status && cur.status !== 'Hadir' && (
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{cur.keterangan || '-'}</span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-icon" onClick={() => openEdit(mhs.id)}><Pencil size={14} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '14px 0 0', textAlign: 'right' }}>
            <button className="btn btn-primary" onClick={handleSave}>Simpan Semua Absensi</button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: '#94a3b8' }}>Pilih jadwal untuk menampilkan daftar mahasiswa</p>
        </div>
      )}

      {editModal && (
        <Modal title="Edit Status Absensi" onClose={() => setEditModal(null)}>
          <div className="modal-body">
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Status</label>
              <select className="form-control" value={editForm.status_absensi}
                onChange={e => setEditForm(p => ({ ...p, status_absensi: e.target.value }))}>
                {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.82rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Keterangan</label>
              <textarea className="form-control" rows={3} value={editForm.keterangan}
                onChange={e => setEditForm(p => ({ ...p, keterangan: e.target.value }))} placeholder="Keterangan (opsional)" />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={() => setEditModal(null)}>Batal</button>
            <button className="btn btn-primary" onClick={handleEditSave}>Simpan</button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
