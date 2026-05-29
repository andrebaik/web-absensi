import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api/client';



import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';

const HARI = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const emptyForm = { mata_kuliah_id: '', dosen_id: '', kelas: '', ruangan_id: '', hari: 'Senin', jam_mulai: '08:00', jam_selesai: '10:00' };

export default function JadwalPage() {
  const [data, setData] = useState([]);
  const [mks, setMks] = useState([]);
  const [dosens, setDosens] = useState([]);
  const [ruangans, setRuangans] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [conflict, setConflict] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  function validate() {
    const e = {};
    if (!form.mata_kuliah_id) e.mata_kuliah_id = 'Wajib dipilih';
    if (!form.dosen_id) e.dosen_id = 'Wajib dipilih';
    if (!form.kelas) e.kelas = 'Kelas wajib diisi';
    if (!form.ruangan_id) e.ruangan_id = 'Wajib dipilih';
    if (!form.jam_mulai || !form.jam_selesai) e.jam = 'Jam wajib diisi';
    else if (form.jam_mulai >= form.jam_selesai) e.jam = 'Jam selesai harus setelah jam mulai';
    return e;
  }

  function openAdd() { setForm(emptyForm); setEditId(null); setErrors({}); setConflict([]); setModal(true); }
  function openEdit(row) {
    setForm({ ...row, mata_kuliah_id: row.mata_kuliah_id, dosen_id: row.dosen_id, ruangan_id: row.ruangan_id });
    setEditId(row.id); setErrors({}); setConflict([]); setModal(true);
  }

  async function fetchData() {
    try {
      const [jadwalRes, mkRes, dosenRes, ruanganRes] = await Promise.all([
        api.get('/jadwal'),
        api.get('/mata-kuliah'),
        api.get('/dosen'),
        api.get('/ruangan'),
      ]);
      setData(Array.isArray(jadwalRes) ? jadwalRes : []);
      setMks(Array.isArray(mkRes) ? mkRes : []);
      setDosens(Array.isArray(dosenRes) ? dosenRes : []);
      setRuangans(Array.isArray(ruanganRes) ? ruanganRes : []);
    } catch (err) {
      console.error('Gagal memuat jadwal:', err);
      addToast('Gagal memuat data', 'error');
    }
  }


  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const payload = {
      ...form,
      mata_kuliah_id: Number(form.mata_kuliah_id),
      dosen_id: Number(form.dosen_id),
      ruangan_id: Number(form.ruangan_id),
    };

    try {
      const res = editId
        ? await api.put(`/jadwal/${editId}`, payload)
        : await api.post('/jadwal', payload);

      // Jika backend mengembalikan error conflict, biasanya bentuknya res.conflicts.
      if (res?.error && Array.isArray(res?.conflicts)) {
        const msgs = res.conflicts.map(c => {
          const mk = mks.find(m => m.id === c.mata_kuliah_id)?.nama_mk || '-';
          const d = dosens.find(x => x.id === c.dosen_id)?.nama || '-';
          let reason = [];
          if (c.dosen_id === payload.dosen_id) reason.push('dosen bentrok');
          if (c.ruangan_id === payload.ruangan_id) reason.push('ruangan bentrok');
          if (c.kelas === payload.kelas) reason.push('kelas bentrok');
          return `${mk} - ${d} (${reason.join(', ')})`;
        });
        setConflict(msgs);
        return;
      }

      addToast(editId ? 'Jadwal berhasil diperbarui' : 'Jadwal berhasil ditambahkan');
      setModal(false);
      setConflict([]);
      await fetchData();
    } catch (err) {
      // backend jadwal conflict akan return 409 + { error:true, conflicts }
      const conflicts = err?.message && typeof err.message === 'string' ? null : err?.conflicts;
      if (err?.conflicts && Array.isArray(err.conflicts)) {
        const msgs = err.conflicts.map(c => {
          const mk = mks.find(m => m.id === c.mata_kuliah_id)?.nama_mk || '-';
          const d = dosens.find(x => x.id === c.dosen_id)?.nama || '-';
          let reason = [];
          if (c.dosen_id === payload.dosen_id) reason.push('dosen bentrok');
          if (c.ruangan_id === payload.ruangan_id) reason.push('ruangan bentrok');
          if (c.kelas === payload.kelas) reason.push('kelas bentrok');
          return `${mk} - ${d} (${reason.join(', ')})`;
        });
        setConflict(msgs);
        return;
      }

      console.error('Gagal menyimpan jadwal:', err);
      addToast('Gagal menyimpan data', 'error');
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/jadwal/${id}`);
      setConfirm(null);
      addToast('Jadwal berhasil dihapus', 'error');
      await fetchData();
    } catch (err) {
      console.error('Gagal menghapus jadwal:', err);
      addToast('Gagal menghapus data', 'error');
    }
  }


  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const getMkName = id => mks.find(m => m.id === id)?.nama_mk || '-';
  const getDosenName = id => dosens.find(d => d.id === id)?.nama || '-';
  const getRuanganName = id => ruangans.find(r => r.id === id)?.nama_ruangan || '-';

  const columns = [
    { key: 'mata_kuliah_id', label: 'Mata Kuliah', render: v => getMkName(v) },
    { key: 'dosen_id', label: 'Dosen', render: v => getDosenName(v) },
    { key: 'kelas', label: 'Kelas' },
    { key: 'ruangan_id', label: 'Ruangan', render: v => getRuanganName(v) },
    { key: 'hari', label: 'Hari' },
    { key: 'jam_mulai', label: 'Jam Mulai' },
    { key: 'jam_selesai', label: 'Jam Selesai' },
  ];

  return (
    <DashboardLayout title="Jadwal Kuliah">
      <div className="page-header">
        <div><h2>Jadwal Perkuliahan</h2><p>Kelola jadwal kuliah (deteksi bentrok otomatis)</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Tambah Jadwal</button>
      </div>
      <div className="card">
        <DataTable columns={columns} data={data} searchKeys={['kelas', 'hari']}
          actions={row => (<>
            <button className="btn btn-icon" onClick={() => openEdit(row)}><Pencil size={15} /></button>
            <button className="btn btn-icon" style={{ color: '#ef4444' }} onClick={() => setConfirm(row.id)}><Trash2 size={15} /></button>
          </>)} />
      </div>
      {modal && (
        <Modal title={editId ? 'Edit Jadwal' : 'Tambah Jadwal'} onClose={() => setModal(false)} size="lg">
          <div className="modal-body">
            {conflict.length > 0 && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontWeight: 600, marginBottom: 6 }}>
                  <AlertTriangle size={16} /> Jadwal Bentrok!
                </div>
                {conflict.map((c, i) => <p key={i} style={{ fontSize: '0.82rem', color: '#ef4444' }}>• {c}</p>)}
              </div>
            )}
            <div className="form-grid">
              <div className="form-group">
                <label>Mata Kuliah</label>
                <select className={`form-control${errors.mata_kuliah_id ? ' error' : ''}`} value={form.mata_kuliah_id}
                  onChange={e => f('mata_kuliah_id', e.target.value)}>
                  <option value="">Pilih Mata Kuliah</option>
                  {mks.map(m => <option key={m.id} value={m.id}>{m.nama_mk}</option>)}
                </select>
                {errors.mata_kuliah_id && <span className="form-error">{errors.mata_kuliah_id}</span>}
              </div>
              <div className="form-group">
                <label>Dosen</label>
                <select className={`form-control${errors.dosen_id ? ' error' : ''}`} value={form.dosen_id}
                  onChange={e => f('dosen_id', e.target.value)}>
                  <option value="">Pilih Dosen</option>
                  {dosens.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
                </select>
                {errors.dosen_id && <span className="form-error">{errors.dosen_id}</span>}
              </div>
              <div className="form-group">
                <label>Kelas</label>
                <input className={`form-control${errors.kelas ? ' error' : ''}`} value={form.kelas}
                  onChange={e => f('kelas', e.target.value)} placeholder="cth: TI-A" />
                {errors.kelas && <span className="form-error">{errors.kelas}</span>}
              </div>
              <div className="form-group">
                <label>Ruangan</label>
                <select className={`form-control${errors.ruangan_id ? ' error' : ''}`} value={form.ruangan_id}
                  onChange={e => f('ruangan_id', e.target.value)}>
                  <option value="">Pilih Ruangan</option>
                  {ruangans.map(r => <option key={r.id} value={r.id}>{r.nama_ruangan}</option>)}
                </select>
                {errors.ruangan_id && <span className="form-error">{errors.ruangan_id}</span>}
              </div>
              <div className="form-group">
                <label>Hari</label>
                <select className="form-control" value={form.hari} onChange={e => f('hari', e.target.value)}>
                  {HARI.map(h => <option key={h}>{h}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Jam Mulai</label>
                <input className="form-control" type="time" value={form.jam_mulai}
                  onChange={e => f('jam_mulai', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Jam Selesai</label>
                <input className={`form-control${errors.jam ? ' error' : ''}`} type="time" value={form.jam_selesai}
                  onChange={e => f('jam_selesai', e.target.value)} />
                {errors.jam && <span className="form-error">{errors.jam}</span>}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={() => setModal(false)}>Batal</button>
            <button className="btn btn-primary" onClick={handleSave}>Simpan</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmDialog title="Hapus Jadwal" message="Yakin ingin menghapus jadwal ini?"
        onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}
    </DashboardLayout>
  );
}
