import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authDB } from '../../data/mockDatabase';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email) { setError('Email wajib diisi.'); return; }
    const user = authDB.findByEmail(email);
    if (!user) { setError('Email tidak ditemukan dalam sistem.'); return; }
    setSent(true);
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <h1>ASINETKW</h1>
          <p>Reset Password</p>
        </div>
        {!sent ? (
          <>
            {error && <div className="login-error">{error}</div>}
            <p style={{ color: '#64748b', fontSize: '0.87rem', marginBottom: 20, textAlign: 'center' }}>
              Masukkan email Anda. Kami akan menampilkan informasi reset password.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Email</label>
                <input className="form-control" type="email" value={email}
                  onChange={e => setEmail(e.target.value)} placeholder="nama@asinetkw.ac.id" style={{ width: '100%' }} />
              </div>
              <button className="login-btn" type="submit">Kirim Reset Password</button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✉️</div>
            <h3 style={{ marginBottom: 8 }}>Permintaan Dikirim</h3>
            <p style={{ color: '#64748b', fontSize: '0.87rem', marginBottom: 8 }}>
              Instruksi reset password telah dikirim ke:
            </p>
            <strong style={{ color: '#1e3a5f' }}>{email}</strong>
            <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: 12 }}>
              (Demo: hubungi admin untuk reset password manual)
            </p>
          </div>
        )}
        <div className="login-links" style={{ marginTop: 20 }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <ArrowLeft size={14} /> Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
