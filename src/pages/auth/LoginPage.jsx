import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import BorderGlow from '../../components/common/BorderGlow';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const demos = [
    { role: 'Admin', email: 'admin@asinetkw.ac.id', pass: 'admin123' },
    { role: 'Dosen 1', email: 'dosen1@asinetkw.ac.id', pass: 'dosen123' },
    { role: 'Mahasiswa 1', email: 'mahasiswa1@asinetkw.ac.id', pass: 'mhs123' },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message);
        return;
      }

      if (result.role === 'admin') navigate('/admin');
      else if (result.role === 'dosen') navigate('/dosen');
      else navigate('/mahasiswa');
    } finally {
      setLoading(false);
    }
  }


  function fillDemo(d) { setEmail(d.email); setPassword(d.pass); setError(''); }

  return (
    <div className="login-page">
      <div className="relative w-full max-w-[420px]">
        <BorderGlow
          className="h-full"
          edgeSensitivity={30}
          glowColor="40 80 80"
          backgroundColor="#0b0a10"
          borderRadius={20}
          glowRadius={40}
          glowIntensity={1.1}
          coneSpread={25}
          animated={false}
          colors={['#c084fc', '#f472b6', '#38bdf8']}
          fillOpacity={0.55}
        >
          <div className="login-box">
            <div className="login-logo">
              <h1>ASINETKW</h1>
              <p>Sistem Absensi &amp; Manajemen Kampus</p>
            </div>
            {error && <div className="login-error">{error}</div>}
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input className="form-control" type="email" value={email}
                  onChange={e => setEmail(e.target.value)} placeholder="nama@asinetkw.ac.id" autoComplete="email" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="password-wrap">
                  <input className="form-control" type={showPass ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" />
                  <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>
            <div className="login-links">
              <a href="/forgot-password">Lupa Password?</a>
            </div>
            <div className="demo-accounts">
              <h4>Akun Demo</h4>
              {demos.map(d => (
                <div key={d.role} className="demo-account" style={{ cursor: 'pointer', padding: '5px 4px', borderRadius: 6 }}
                  onClick={() => fillDemo(d)} title="Klik untuk isi otomatis">
                  <span>{d.role}</span>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{d.email} · {d.pass}</span>
                </div>
              ))}
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 8 }}></p>
            </div>
          </div>
        </BorderGlow>
      </div>
    </div>
  );
}
