import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { absensiDB, mahasiswaDB, jadwalDB, mataKuliahDB, dosenDB } from '../../data/mockDatabase';
import { useToast } from '../../context/ToastContext';
import { Pencil, Trash2 } from 'lucide-react';

const STATUS_LIST = ['Hadir', 'Izin', 'Sakit', 'Alpha'];
const statusColor = s => ({ Hadir: 'badge-success', Izin: 'badge-blue', Sakit: 'badge-warning', Alpha: 'badge-danger' }[s] || 'badge-gray');

export default function AbsensiPage() {
  const [data, setData] = useState([]);
  const [mhsList, setMhsList] = useState([]);
  const [jadwalList, setJadwalList] = useState([]);
  const [mkList, setMkList] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ status_absensi: 'Hadir', keterangan: '' });
  const [editId, setEditId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    setMhsList(mahasiswaDB.getAll());
    setJadwalList(jadwalDB.getAll());
    setMkList(mataKuliahDB.getAll());
    setData(absensiDB.getAll());
  }, []);

  function getMhsName(id) { return mhsList.find(m => m.id === id)?.nama || '-'; }
  function getMkName(jadwalId) {
    const j = jadwalList.find(j => j.id === jadwalId);
    return j ? mkList.find(m => m.id === j.mata_kuliah_id)?.nama_mk || '-' : '-';
  }

  function openEdit(row) { setForm({ status_absensi: row.status_absensi, keterangan: row.keterangan || '' }); setEditId(row.id); setModal(true); }

  function handleSave() {
    absensiDB.update(editId, form);
    setData(absensiDB.getAll());
    setModal(false);
    addToast('Absensi berhasil diperbarui');
  }

  function handleDelete(id) {
    absensiDB.delete(id); setData(absensiDB.getAll()); setConfirm(null);
    addToast('Data absensi dihapus', 'error');
  }

  const columns = [
    { key: 'mahasiswa_id', label: 'Mahasiswa', render: v => getMhsName(v) },
    { key: 'jadwal_id', label: 'Mata Kuliah', render: v => getMkName(v) },
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'pertemuan_ke', label: 'Pertemuan' },
    { key: 'status_absensi', label: 'Status', render: v => <span className={`badge ${statusColor(v)}`}>{v}</span> },
    { key: 'keterangan', label: 'Keterangan' },
  ];

  return (
    <DashboardLayout title="Data Absensi">
      <div className="page-header">
        <div><h2>Data Absensi</h2><p>Kelola semua data absensi mahasiswa</p></div>
      </div>
      <div className="card">
        <DataTable columns={columns} data={data} searchKeys={['tanggal', 'status_absensi']}
          actions={row => (<>
            <button className="btn btn-icon" title="Edit" onClick={() => openEdit(row)}><Pencil size={15} /></button>
            <button className="btn btn-icon" title="Hapus" style={{ color: '#ef4444' }} onClick={() => setConfirm(row.id)}><Trash2 size={15} /></button>
          </>)} />
      </div>
      {modal && (
        <Modal title="Edit Absensi" onClose={() => setModal(false)}>
          <div className="modal-body">
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Status Absensi</label>
              <select className="form-control" value={form.status_absensi} onChange={e => setForm(p => ({ ...p, status_absensi: e.target.value }))}>
                {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.82rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Keterangan</label>
              <textarea className="form-control" rows={3} value={form.keterangan}
                onChange={e => setForm(p => ({ ...p, keterangan: e.target.value }))} placeholder="Keterangan (opsional)" />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={() => setModal(false)}>Batal</button>
            <button className="btn btn-primary" onClick={handleSave}>Simpan</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmDialog title="Hapus Absensi" message="Yakin ingin menghapus data absensi ini?"
        onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}
    </DashboardLayout>
  );
}
