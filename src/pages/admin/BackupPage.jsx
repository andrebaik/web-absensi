import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { mahasiswaDB, dosenDB, mataKuliahDB, ruanganDB, jadwalDB, absensiDB, backupLogDB } from '../../data/mockDatabase';
import { exportToCSV } from '../../utils/exportCSV';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Download, Database } from 'lucide-react';

const backupItems = [
  { key: 'mahasiswa', label: 'Data Mahasiswa', desc: 'NIM, Nama, Email, Prodi, Kelas, Semester, Status',
    fn: () => mahasiswaDB.getAll(), cols: [
      { key: 'nim', label: 'NIM' }, { key: 'nama', label: 'Nama' }, { key: 'email', label: 'Email' },
      { key: 'prodi', label: 'Prodi' }, { key: 'kelas', label: 'Kelas' }, { key: 'semester', label: 'Semester' }, { key: 'status', label: 'Status' }
    ]},
  { key: 'dosen', label: 'Data Dosen', desc: 'NIDN, Nama, Email, Prodi, No HP, Status',
    fn: () => dosenDB.getAll(), cols: [
      { key: 'nidn', label: 'NIDN' }, { key: 'nama', label: 'Nama' }, { key: 'email', label: 'Email' },
      { key: 'prodi', label: 'Prodi' }, { key: 'no_hp', label: 'No HP' }, { key: 'status', label: 'Status' }
    ]},
  { key: 'mata_kuliah', label: 'Data Mata Kuliah', desc: 'Kode MK, Nama, SKS, Semester, Prodi',
    fn: () => mataKuliahDB.getAll(), cols: [
      { key: 'kode_mk', label: 'Kode MK' }, { key: 'nama_mk', label: 'Nama' }, { key: 'sks', label: 'SKS' },
      { key: 'semester', label: 'Semester' }, { key: 'prodi', label: 'Prodi' }
    ]},
  { key: 'ruangan', label: 'Data Ruangan', desc: 'Kode, Nama, Kapasitas, Lokasi, Status',
    fn: () => ruanganDB.getAll(), cols: [
      { key: 'kode_ruangan', label: 'Kode' }, { key: 'nama_ruangan', label: 'Nama' }, { key: 'kapasitas', label: 'Kapasitas' },
      { key: 'lokasi', label: 'Lokasi' }, { key: 'status', label: 'Status' }
    ]},
  { key: 'jadwal', label: 'Data Jadwal', desc: 'ID Mata Kuliah, Dosen, Kelas, Ruangan, Hari, Jam',
    fn: () => jadwalDB.getAll(), cols: [
      { key: 'id', label: 'ID' }, { key: 'mata_kuliah_id', label: 'ID Mata Kuliah' }, { key: 'dosen_id', label: 'ID Dosen' },
      { key: 'kelas', label: 'Kelas' }, { key: 'ruangan_id', label: 'ID Ruangan' }, { key: 'hari', label: 'Hari' },
      { key: 'jam_mulai', label: 'Jam Mulai' }, { key: 'jam_selesai', label: 'Jam Selesai' }
    ]},
  { key: 'absensi', label: 'Data Absensi', desc: 'ID Jadwal, Mahasiswa, Tanggal, Pertemuan, Status',
    fn: () => absensiDB.getAll(), cols: [
      { key: 'id', label: 'ID' }, { key: 'jadwal_id', label: 'ID Jadwal' }, { key: 'mahasiswa_id', label: 'ID Mahasiswa' },
      { key: 'tanggal', label: 'Tanggal' }, { key: 'pertemuan_ke', label: 'Pertemuan' },
      { key: 'status_absensi', label: 'Status' }, { key: 'keterangan', label: 'Keterangan' }
    ]},
];

export default function BackupPage() {
  const [logs, setLogs] = useState(() => backupLogDB.getAll());
  const { user } = useAuth();
  const { addToast } = useToast();

  function handleBackup(item) {
    const data = item.fn();
    const ok = exportToCSV(item.key, data, item.cols);
    if (ok) {
      const log = backupLogDB.create({ nama_data: item.label, admin_id: user.id });
      setLogs(backupLogDB.getAll());
      addToast(`Backup ${item.label} berhasil diunduh`);
    } else {
      addToast('Tidak ada data untuk dibackup', 'warning');
    }
  }

  return (
    <DashboardLayout title="Backup Data">
      <div className="page-header">
        <div><h2>Backup & Export Data</h2><p>Unduh data dalam format CSV</p></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16, marginBottom: 28 }}>
        {backupItems.map(item => (
          <div key={item.key} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Database size={18} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</p>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.desc}</p>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => handleBackup(item)}>
              <Download size={13} /> Export CSV
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Riwayat Backup</h3></div>
        {logs.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.87rem', textAlign: 'center', padding: '24px 0' }}>Belum ada riwayat backup</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>No</th><th>Data</th><th>Tanggal</th></tr></thead>
              <tbody>
                {logs.map((l, i) => (
                  <tr key={l.id}>
                    <td>{i + 1}</td>
                    <td>{l.nama_data}</td>
                    <td>{l.tanggal_backup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
