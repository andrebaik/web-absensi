import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api/client';

import { Plus, Pencil, Trash2, Shield } from 'lucide-react';

const emptyForm = { name: '', email: '', password: '', role: 'mahasiswa' };
const ROLES = ['admin', 'dosen', 'mahasiswa'];
const roleColor = r => ({ admin: 'badge-danger', dosen: 'badge-blue', mahasiswa: 'badge-success' }[r] || 'badge-gray');

export default function HakAksesPage() {
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
        const res = await api.get('/users');
        setData(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Gagal memuat user:', err);
        addToast('Gagal memuat data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addToast]);


  function validate() {
    const e = {};
    if (!form.name) e.name = 'Nama wajib diisi';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email tidak valid';
    if (!editId && !form.password) e.password = 'Password wajib diisi';
    if (!form.role) e.role = 'Role wajib dipilih';
    return e;
  }

  function openAdd() { setForm(emptyForm); setEditId(null); setErrors({}); setModal(true); }
  function openEdit(row) { setForm({ name: row.name, email: row.email, password: '', role: row.role }); setEditId(row.id); setErrors({}); setModal(true); }

  async function fetchData() {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Gagal memuat user:', err);
      addToast('Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    try {
      const payload = { ...form };
      if (editId && !form.password) delete payload.password;

      if (editId) {
        await api.put(`/users/${editId}`, payload);
        addToast('User berhasil diperbarui');
      } else {
        await api.post('/users', payload);
        addToast('User berhasil ditambahkan');
      }

      await fetchData();
      setModal(false);
    } catch (err) {
      console.error('Gagal menyimpan user:', err);
      addToast('Gagal menyimpan data', 'error');
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/users/${id}`);
      setConfirm(null);
      addToast('User berhasil dihapus', 'error');
      await fetchData();
    } catch (err) {
      console.error('Gagal menghapus user:', err);
      addToast('Gagal menghapus data', 'error');
    }
  }


  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const columns = [
    { key: 'name', label: 'Nama' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: v => <span className={`badge ${roleColor(v)}`}>{v.charAt(0).toUpperCase() + v.slice(1)}</span> },
    { key: 'created_at', label: 'Dibuat' },
  ];

  return (
    <DashboardLayout title="Hak Akses Pengguna">
      <div className="page-header">
        <div><h2>Hak Akses Pengguna</h2><p>Kelola akun dan role pengguna sistem</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Tambah User</button>
      </div>
      <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
        <Shield size={16} style={{ color: '#f59e0b' }} />
        <span style={{ fontSize: '0.85rem', color: '#92400e' }}>Hanya Admin yang dapat mengakses halaman ini. Setiap role memiliki hak akses berbeda.</span>
      </div>
      <div className="card">
        <DataTable columns={columns} data={data} searchKeys={['name', 'email', 'role']}
          actions={row => (<>
            <button className="btn btn-icon" onClick={() => openEdit(row)}><Pencil size={15} /></button>
            <button className="btn btn-icon" style={{ color: '#ef4444' }} onClick={() => setConfirm(row.id)}><Trash2 size={15} /></button>
          </>)} />
      </div>
      {modal && (
        <Modal title={editId ? 'Edit User' : 'Tambah User'} onClose={() => setModal(false)}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group full">
                <label>Nama Lengkap</label>
                <input className={`form-control${errors.name ? ' error' : ''}`} value={form.name}
                  onChange={e => f('name', e.target.value)} placeholder="Nama lengkap" />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input className={`form-control${errors.email ? ' error' : ''}`} type="email" value={form.email}
                  onChange={e => f('email', e.target.value)} placeholder="email@asinetkw.ac.id" />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Password {editId && <span style={{ color: '#94a3b8', fontWeight: 400 }}>(kosong = tidak diubah)</span>}</label>
                <input className={`form-control${errors.password ? ' error' : ''}`} type="password" value={form.password}
                  onChange={e => f('password', e.target.value)} placeholder="Password" />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>
              <div className="form-group full">
                <label>Role</label>
                <select className="form-control" value={form.role} onChange={e => f('role', e.target.value)}>
                  {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
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
      {confirm && <ConfirmDialog title="Hapus User" message="Yakin ingin menghapus akun ini?"
        onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}
    </DashboardLayout>
  );
}
