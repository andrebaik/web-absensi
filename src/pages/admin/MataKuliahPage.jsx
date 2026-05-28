import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { mataKuliahDB } from '../../data/mockDatabase';
import { useToast } from '../../context/ToastContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const emptyForm = { kode_mk: '', nama_mk: '', sks: 3, semester: 1, prodi: '' };
const PRODI = ['Teknik Informatika', 'Sistem Informasi', 'Manajemen Informatika'];

export default function MataKuliahPage() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirm, setConfirm] = useState(null);
  const { addToast } = useToast();

  useEffect(() => { setData(mataKuliahDB.getAll()); }, []);

  function validate() {
    const e = {};
    if (!form.kode_mk) e.kode_mk = 'Kode MK wajib diisi';
    if (!form.nama_mk) e.nama_mk = 'Nama MK wajib diisi';
    if (!form.prodi) e.prodi = 'Prodi wajib dipilih';
    if (!form.sks || form.sks < 1) e.sks = 'SKS minimal 1';
    if (!form.semester || form.semester < 1) e.semester = 'Semester minimal 1';
    return e;
  }

  function openAdd() { setForm(emptyForm); setEditId(null); setErrors({}); setModal(true); }
  function openEdit(row) { setForm({ ...row }); setEditId(row.id); setErrors({}); setModal(true); }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editId) { mataKuliahDB.update(editId, form); addToast('Mata kuliah berhasil diperbarui'); }
    else { mataKuliahDB.create(form); addToast('Mata kuliah berhasil ditambahkan'); }
    setData(mataKuliahDB.getAll()); setModal(false);
  }

  function handleDelete(id) {
    mataKuliahDB.delete(id); setData(mataKuliahDB.getAll()); setConfirm(null);
    addToast('Mata kuliah berhasil dihapus', 'error');
  }

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const columns = [
    { key: 'kode_mk', label: 'Kode MK' },
    { key: 'nama_mk', label: 'Nama Mata Kuliah' },
    { key: 'sks', label: 'SKS' },
    { key: 'semester', label: 'Semester' },
    { key: 'prodi', label: 'Prodi' },
  ];

  return (
    <DashboardLayout title="Mata Kuliah">
      <div className="page-header">
        <div><h2>Data Mata Kuliah</h2><p>Kelola data mata kuliah</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Tambah Mata Kuliah</button>
      </div>
      <div className="card">
        <DataTable columns={columns} data={data} searchKeys={['kode_mk', 'nama_mk', 'prodi']}
          actions={row => (<>
            <button className="btn btn-icon" onClick={() => openEdit(row)}><Pencil size={15} /></button>
            <button className="btn btn-icon" style={{ color: '#ef4444' }} onClick={() => setConfirm(row.id)}><Trash2 size={15} /></button>
          </>)} />
      </div>
      {modal && (
        <Modal title={editId ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'} onClose={() => setModal(false)}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Kode MK</label>
                <input className={`form-control${errors.kode_mk ? ' error' : ''}`} value={form.kode_mk}
                  onChange={e => f('kode_mk', e.target.value)} placeholder="cth: TI301" />
                {errors.kode_mk && <span className="form-error">{errors.kode_mk}</span>}
              </div>
              <div className="form-group">
                <label>Nama Mata Kuliah</label>
                <input className={`form-control${errors.nama_mk ? ' error' : ''}`} value={form.nama_mk}
                  onChange={e => f('nama_mk', e.target.value)} placeholder="Nama mata kuliah" />
                {errors.nama_mk && <span className="form-error">{errors.nama_mk}</span>}
              </div>
              <div className="form-group">
                <label>SKS</label>
                <input className={`form-control${errors.sks ? ' error' : ''}`} type="number" min={1} max={6} value={form.sks}
                  onChange={e => f('sks', parseInt(e.target.value))} />
                {errors.sks && <span className="form-error">{errors.sks}</span>}
              </div>
              <div className="form-group">
                <label>Semester</label>
                <input className={`form-control${errors.semester ? ' error' : ''}`} type="number" min={1} max={14} value={form.semester}
                  onChange={e => f('semester', parseInt(e.target.value))} />
                {errors.semester && <span className="form-error">{errors.semester}</span>}
              </div>
              <div className="form-group full">
                <label>Program Studi</label>
                <select className={`form-control${errors.prodi ? ' error' : ''}`} value={form.prodi} onChange={e => f('prodi', e.target.value)}>
                  <option value="">Pilih Prodi</option>
                  {PRODI.map(p => <option key={p}>{p}</option>)}
                </select>
                {errors.prodi && <span className="form-error">{errors.prodi}</span>}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={() => setModal(false)}>Batal</button>
            <button className="btn btn-primary" onClick={handleSave}>Simpan</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmDialog title="Hapus Mata Kuliah" message="Yakin ingin menghapus mata kuliah ini?"
        onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}
    </DashboardLayout>
  );
}
