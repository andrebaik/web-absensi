import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

import { useToast } from '../../context/ToastContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '../../api/client';


const emptyForm = { kode_ruangan: '', nama_ruangan: '', kapasitas: 30, lokasi: '', status: 'Tersedia' };
const STATUS = ['Tersedia', 'Tidak Tersedia', 'Dalam Perbaikan'];

export default function RuanganPage() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirm, setConfirm] = useState(null);
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/ruangan');
        setData(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Gagal mengambil data ruangan:', err);
        addToast('Gagal memuat data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addToast]);


  function validate() {
    const e = {};
    if (!form.kode_ruangan) e.kode_ruangan = 'Kode wajib diisi';
    if (!form.nama_ruangan) e.nama_ruangan = 'Nama wajib diisi';
    if (!form.lokasi) e.lokasi = 'Lokasi wajib diisi';
    if (!form.kapasitas || form.kapasitas < 1) e.kapasitas = 'Kapasitas minimal 1';
    return e;
  }

  function openAdd() { setForm(emptyForm); setEditId(null); setErrors({}); setModal(true); }
  function openEdit(row) { setForm({ ...row }); setEditId(row.id); setErrors({}); setModal(true); }

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ruangan');
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Gagal mengambil data ruangan:', err);
      addToast('Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    try {
      if (editId) {
        await api.put(`/ruangan/${editId}`, form);
        addToast('Ruangan berhasil diperbarui');
      } else {
        await api.post('/ruangan', form);
        addToast('Ruangan berhasil ditambahkan');
      }
      await fetchData();
      setModal(false);
    } catch (err) {
      console.error('Gagal menyimpan ruangan:', err);
      addToast('Gagal menyimpan data', 'error');
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/ruangan/${id}`);
      setConfirm(null);
      addToast('Ruangan berhasil dihapus', 'error');
      await fetchData();
    } catch (err) {
      console.error('Gagal menghapus ruangan:', err);
      addToast('Gagal menghapus data', 'error');
    }
  }


  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const statusColor = v => v === 'Tersedia' ? 'badge-success' : v === 'Dalam Perbaikan' ? 'badge-warning' : 'badge-danger';

  const columns = [
    { key: 'kode_ruangan', label: 'Kode' },
    { key: 'nama_ruangan', label: 'Nama Ruangan' },
    { key: 'kapasitas', label: 'Kapasitas' },
    { key: 'lokasi', label: 'Lokasi' },
    { key: 'status', label: 'Status', render: v => <span className={`badge ${statusColor(v)}`}>{v}</span> },
  ];

  return (
    <DashboardLayout title="Data Ruangan">
      <div className="page-header">
        <div><h2>Data Ruangan</h2><p>Kelola data ruang perkuliahan</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Tambah Ruangan</button>
      </div>
      <div className="card">
        <DataTable columns={columns} data={data} searchKeys={['kode_ruangan', 'nama_ruangan', 'lokasi']}
          actions={row => (<>
            <button className="btn btn-icon" onClick={() => openEdit(row)}><Pencil size={15} /></button>
            <button className="btn btn-icon" style={{ color: '#ef4444' }} onClick={() => setConfirm(row.id)}><Trash2 size={15} /></button>
          </>)} />
      </div>
      {modal && (
        <Modal title={editId ? 'Edit Ruangan' : 'Tambah Ruangan'} onClose={() => setModal(false)}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Kode Ruangan</label>
                <input className={`form-control${errors.kode_ruangan ? ' error' : ''}`} value={form.kode_ruangan}
                  onChange={e => f('kode_ruangan', e.target.value)} placeholder="cth: R101" />
                {errors.kode_ruangan && <span className="form-error">{errors.kode_ruangan}</span>}
              </div>
              <div className="form-group">
                <label>Nama Ruangan</label>
                <input className={`form-control${errors.nama_ruangan ? ' error' : ''}`} value={form.nama_ruangan}
                  onChange={e => f('nama_ruangan', e.target.value)} placeholder="Nama ruangan" />
                {errors.nama_ruangan && <span className="form-error">{errors.nama_ruangan}</span>}
              </div>
              <div className="form-group">
                <label>Kapasitas</label>
                <input className={`form-control${errors.kapasitas ? ' error' : ''}`} type="number" min={1} value={form.kapasitas}
                  onChange={e => f('kapasitas', parseInt(e.target.value))} />
                {errors.kapasitas && <span className="form-error">{errors.kapasitas}</span>}
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="form-control" value={form.status} onChange={e => f('status', e.target.value)}>
                  {STATUS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group full">
                <label>Lokasi</label>
                <input className={`form-control${errors.lokasi ? ' error' : ''}`} value={form.lokasi}
                  onChange={e => f('lokasi', e.target.value)} placeholder="cth: Gedung A Lantai 1" />
                {errors.lokasi && <span className="form-error">{errors.lokasi}</span>}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={() => setModal(false)}>Batal</button>
            <button className="btn btn-primary" onClick={handleSave}>Simpan</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmDialog title="Hapus Ruangan" message="Yakin ingin menghapus ruangan ini?"
        onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}
    </DashboardLayout>
  );
}
