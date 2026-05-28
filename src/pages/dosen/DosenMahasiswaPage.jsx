import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { jadwalDB, mahasiswaDB, mataKuliahDB } from '../../data/mockDatabase';
import DataTable from '../../components/common/DataTable';

export default function DosenMahasiswaPage() {
  const { profile } = useAuth();
  const [kelas, setKelas] = useState('');
  const [kelasList, setKelasList] = useState([]);
  const [mahasiswaList, setMahasiswaList] = useState([]);

  useEffect(() => {
    if (!profile) return;
    const jadwal = jadwalDB.getByDosen(profile.id);
    const uniqueKelas = [...new Set(jadwal.map(j => j.kelas))];
    setKelasList(uniqueKelas);
    if (uniqueKelas.length > 0) { setKelas(uniqueKelas[0]); }
  }, [profile]);

  useEffect(() => {
    if (!kelas) return;
    setMahasiswaList(mahasiswaDB.getAll().filter(m => m.kelas === kelas));
  }, [kelas]);

  const columns = [
    { key: 'nim', label: 'NIM' },
    { key: 'nama', label: 'Nama' },
    { key: 'email', label: 'Email' },
    { key: 'prodi', label: 'Prodi' },
    { key: 'semester', label: 'Semester' },
    { key: 'status', label: 'Status', render: v => <span className={`badge ${v === 'Aktif' ? 'badge-success' : 'badge-gray'}`}>{v}</span> },
  ];

  return (
    <DashboardLayout title="Data Mahasiswa">
      <div className="page-header">
        <div><h2>Data Mahasiswa</h2><p>Mahasiswa berdasarkan kelas yang Anda ajar</p></div>
      </div>
      <div className="card">
        <div className="table-controls">
          <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Filter Kelas:</label>
          <select className="filter-select" value={kelas} onChange={e => setKelas(e.target.value)}>
            {kelasList.map(k => <option key={k}>{k}</option>)}
          </select>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{mahasiswaList.length} mahasiswa</span>
        </div>
        <DataTable columns={columns} data={mahasiswaList} searchKeys={['nim', 'nama', 'email']} />
      </div>
    </DashboardLayout>
  );
}
