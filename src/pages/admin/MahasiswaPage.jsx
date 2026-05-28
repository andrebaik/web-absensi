import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const emptyForm = { nim: '', nama: '', email: '', prodi: '', kelas: '', semester: '', status: 'Aktif' };
const PRODI = ['Teknik Informatika', 'Sistem Informasi', 'Manajemen Informatika'];
const STATUS = ['Aktif', 'Non-Aktif', 'Cuti', 'Lulus'];

export default function MahasiswaPage() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirm, setConfirm] = useState(null);
  const { addToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.token) return;
    api.get('/mahasiswa').then(setData).catch(() => addToast('Gagal memuat data mahasiswa', 'error'));
  }, [user]);


  function validate() {
    const e = {};
    if (!form.nim) e.nim = 'NIM wajib diisi';
    if (!form.nama) e.nama = 'Nama wajib diisi';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email tidak valid';
    if (!form.prodi) e.prodi = 'Program studi wajib dipilih';
    if (!form.kelas) e.kelas = 'Kelas wajib diisi';
    if (!form.semester || form.semester < 1 || form.semester > 14) e.semester = 'Semester 1-14';
    return e;
  }

  function openAdd() { setForm(emptyForm); setEditId(null); setErrors({}); setModal(true); }
  function openEdit(row) { setForm({ ...row }); setEditId(row.id); setErrors({}); setModal(true); }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    (async () => {
      try {
        if (editId) {
          await api.put(`/mahasiswa/${editId}`, form, user?.token);
          addToast('Data mahasiswa berhasil diperbarui');
        } else {
          await api.post('/mahasiswa', form, user?.token);
          addToast('Mahasiswa berhasil ditambahkan');
        }
        const rows = await api.get('/mahasiswa', user?.token);
        setData(rows);
        setModal(false);
      } catch (e) {
        addToast(e.message || 'Gagal menyimpan data mahasiswa', 'error');
      }
    })();
  }

  function handleDelete(id) {
    (async () => {
      try {
        await api.del(`/mahasiswa/${id}`, user?.token);
        const rows = await api.get('/mahasiswa', user?.token);
        setData(rows);
        setConfirm(null);
        addToast('Data mahasiswa berhasil dihapus', 'error');
      } catch (e) {
        addToast(e.message || 'Gagal menghapus data mahasiswa', 'error');
      }
    })();
  }


  const columns = [
    { key: 'nim', label: 'NIM' },
    { key: 'nama', label: 'Nama' },
    { key: 'email', label: 'Email' },
    { key: 'prodi', label: 'Prodi' },
    { key: 'kelas', label: 'Kelas' },
    { key: 'semester', label: 'Semester' },
    { key: 'status', label: 'Status', render: v => (
      <span className={`badge ${v === 'Aktif' ? 'badge-success' : v === 'Cuti' ? 'badge-warning' : 'badge-gray'}`}>{v}</span>
    )},
  ];

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <DashboardLayout title="Data Mahasiswa">
      <div className="page-header">
        <div><h2>Data Mahasiswa</h2><p>Kelola data mahasiswa terdaftar</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Tambah Mahasiswa</button>
      </div>
      <div className="card">
        <DataTable columns={columns} data={data} searchKeys={['nim', 'nama', 'email', 'prodi', 'kelas']}
          actions={row => (<>
            <button className="btn btn-icon" title="Edit" onClick={() => openEdit(row)}><Pencil size={15} /></button>
            <button className="btn btn-icon" title="Hapus" style={{ color: '#ef4444' }} onClick={() => setConfirm(row.id)}><Trash2 size={15} /></button>
          </>)} />
      </div>

      {modal && (
        <Modal title={editId ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'} onClose={() => setModal(false)}>
          <div className="modal-body">
            <div className="form-grid">
              {[['nim','NIM','text'], ['nama','Nama Lengkap','text'], ['email','Email','email'], ['kelas','Kelas','text']].map(([k, lb, tp]) => (
                <div key={k} className="form-group">
                  <label>{lb}</label>
                  <input className={`form-control${errors[k] ? ' error' : ''}`} type={tp} value={form[k]}
                    onChange={e => f(k, e.target.value)} placeholder={lb} />
                  {errors[k] && <span className="form-error">{errors[k]}</span>}
                </div>
              ))}
              <div className="form-group">
                <label>Program Studi</label>
                <select className={`form-control${errors.prodi ? ' error' : ''}`} value={form.prodi} onChange={e => f('prodi', e.target.value)}>
                  <option value="">Pilih Prodi</option>
                  {PRODI.map(p => <option key={p}>{p}</option>)}
                </select>
                {errors.prodi && <span className="form-error">{errors.prodi}</span>}
              </div>
              <div className="form-group">
                <label>Semester</label>
                <input className={`form-control${errors.semester ? ' error' : ''}`} type="number" min={1} max={14} value={form.semester}
                  onChange={e => f('semester', parseInt(e.target.value))} />
                {errors.semester && <span className="form-error">{errors.semester}</span>}
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="form-control" value={form.status} onChange={e => f('status', e.target.value)}>
                  {STATUS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={() => setModal(false)}>Batal</button>
            <button className="btn btn-primary" onClick={handleSave}>Simpan</button>
          </div>
        </Modal>
      )}
      {confirm && (
        <ConfirmDialog title="Hapus Mahasiswa" message="Apakah Anda yakin ingin menghapus data mahasiswa ini?"
          onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />
      )}
    </DashboardLayout>
  );
}
