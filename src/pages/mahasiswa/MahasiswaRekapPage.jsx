import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';



export default function MahasiswaRekapPage() {
  const { profile } = useAuth();
  const [rekap, setRekap] = useState([]);

  useEffect(() => {
    if (!profile?.id) return;

    (async () => {
      try {
        const res = await api.get(`/absensi/rekap/mahasiswa/${profile.id}`, profile.token);
        setRekap(Array.isArray(res) ? res : []);
      } catch {
        // biarkan rekap kosong
      }
    })();
  }, [profile]);


  const barColor = p => p >= 75 ? '#10b981' : p >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <DashboardLayout title="Rekap Absensi">
      <div className="page-header">
        <div><h2>Rekap Absensi Saya</h2><p>Ringkasan kehadiran per mata kuliah</p></div>
      </div>
      {rekap.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
          <p style={{ color: '#94a3b8' }}>Belum ada data absensi</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {rekap.map((r, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{r.mata_kuliah}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: 2 }}>{r.total} pertemuan tercatat</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: barColor(r.persentase) }}>{r.persentase}%</div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Kehadiran</p>
                </div>
              </div>
              <div className="progress-bar" style={{ height: 10, marginBottom: 16 }}>
                <div className="progress-fill" style={{ width: `${r.persentase}%`, background: barColor(r.persentase) }} />
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 80, textAlign: 'center', padding: '10px 6px', background: 'rgba(16,185,129,0.08)', borderRadius: 8 }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#10b981' }}>{r.hadir}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Hadir</div>
                </div>
                <div style={{ flex: 1, minWidth: 80, textAlign: 'center', padding: '10px 6px', background: 'rgba(99,102,241,0.08)', borderRadius: 8 }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#6366f1' }}>{r.izin}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Izin</div>
                </div>
                <div style={{ flex: 1, minWidth: 80, textAlign: 'center', padding: '10px 6px', background: 'rgba(245,158,11,0.08)', borderRadius: 8 }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f59e0b' }}>{r.sakit}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Sakit</div>
                </div>
                <div style={{ flex: 1, minWidth: 80, textAlign: 'center', padding: '10px 6px', background: 'rgba(239,68,68,0.08)', borderRadius: 8 }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ef4444' }}>{r.alpha}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Alpha</div>
                </div>
              </div>
              {r.persentase < 75 && (
                <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.06)', borderRadius: 8, fontSize: '0.8rem', color: '#ef4444' }}>
                  ⚠️ Kehadiran di bawah 75%! Segera hubungi dosen terkait.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
