import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { dosenDB } from '../../data/mockDatabase';
import { useToast } from '../../context/ToastContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const emptyForm = { nidn: '', nama: '', email: '', prodi: '', no_hp: '', status: 'Aktif' };
const PRODI = ['Teknik Informatika', 'Sistem Informasi', 'Manajemen Informatika'];

export default function DosenPage() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirm, setConfirm] = useState(null);
  const { addToast } = useToast();

  useEffect(() => { setData(dosenDB.getAll()); }, []);

  function validate() {
    const e = {};
    if (!form.nidn) e.nidn = 'NIDN wajib diisi';
    if (!form.nama) e.nama = 'Nama wajib diisi';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email tidak valid';
    if (!form.prodi) e.prodi = 'Prodi wajib dipilih';
    if (!form.no_hp) e.no_hp = 'No HP wajib diisi';
    return e;
  }

  function openAdd() { setForm(emptyForm); setEditId(null); setErrors({}); setModal(true); }
  function openEdit(row) { setForm({ ...row }); setEditId(row.id); setErrors({}); setModal(true); }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editId) { dosenDB.update(editId, form); addToast('Data dosen berhasil diperbarui'); }
    else { dosenDB.create(form); addToast('Dosen berhasil ditambahkan'); }
    setData(dosenDB.getAll()); setModal(false);
  }

  function handleDelete(id) {
    dosenDB.delete(id); setData(dosenDB.getAll()); setConfirm(null);
    addToast('Data dosen berhasil dihapus', 'error');
  }

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const columns = [
    { key: 'nidn', label: 'NIDN' },
    { key: 'nama', label: 'Nama' },
    { key: 'email', label: 'Email' },
    { key: 'prodi', label: 'Prodi' },
    { key: 'no_hp', label: 'No HP' },
    { key: 'status', label: 'Status', render: v => <span className={`badge ${v === 'Aktif' ? 'badge-success' : 'badge-gray'}`}>{v}</span> },
  ];

  return (
    <DashboardLayout title="Data Dosen">
      <div className="page-header">
        <div><h2>Data Dosen</h2><p>Kelola data dosen pengajar</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Tambah Dosen</button>
      </div>
      <div className="card">
        <DataTable columns={columns} data={data} searchKeys={['nidn', 'nama', 'email', 'prodi']}
          actions={row => (<>
            <button className="btn btn-icon" onClick={() => openEdit(row)}><Pencil size={15} /></button>
            <button className="btn btn-icon" style={{ color: '#ef4444' }} onClick={() => setConfirm(row.id)}><Trash2 size={15} /></button>
          </>)} />
      </div>
      {modal && (
        <Modal title={editId ? 'Edit Dosen' : 'Tambah Dosen'} onClose={() => setModal(false)}>
          <div className="modal-body">
            <div className="form-grid">
              {[['nidn','NIDN','text'], ['nama','Nama Lengkap','text'], ['email','Email','email'], ['no_hp','Nomor HP','text']].map(([k, lb, tp]) => (
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
                <label>Status</label>
                <select className="form-control" value={form.status} onChange={e => f('status', e.target.value)}>
                  <option>Aktif</option><option>Non-Aktif</option>
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
      {confirm && <ConfirmDialog title="Hapus Dosen" message="Yakin ingin menghapus data dosen ini?"
        onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}
    </DashboardLayout>
  );
}
