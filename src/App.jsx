import React, { useState, createContext, useContext, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';

// Languages and other constants
const languages = [
  { name: 'JavaScript', emoji: '🟨' },
  { name: 'Python', emoji: '🐍' },
  { name: 'Java', emoji: '☕' },
  { name: 'C#', emoji: '🎯' },
  { name: 'Go', emoji: '🐹' },
  { name: 'Rust', emoji: '🦀' },
  { name: 'TypeScript', emoji: '🔷' },
];

// LanguageContext
const LanguageContext = createContext();

function App() {
  const [varOcg, setVarOcg] = useState(0);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [user, setUser] = useState(null);

  const toggleLanguage = () => setVarOcg(prev => (prev + 1) % languages.length);
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  const contextValue = {
    favorite: languages[varOcg],
    toggleLanguage,
    toggleDarkMode,
    darkMode,
    user,
    setUser,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      <Router>
        <div style={appStyle(darkMode)}>
          <Header />
          <main style={{ flex: 1, padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageContext.Provider>
  );
}

// Header Component
function Header() {
  const { darkMode, toggleDarkMode, user, setUser } = useContext(LanguageContext);
  const navigate = useNavigate();

  return (
    <header style={headerStyle(darkMode)}>
      <nav style={navStyle}>
        <h1 style={{ fontSize: '1.5rem' }}>LanguageToggle</h1>
        <div style={navActionsStyle}>
          {!user ? (
            <>
              <button style={navButtonStyle} onClick={() => navigate('/signup')}>Sign Up</button>
              <button style={navButtonStyle} onClick={() => navigate('/login')}>Login</button>
            </>
          ) : (
           <>
            <button style={navButtonStyle} onClick={() => navigate('/')}>Home</button>
            <button style={navButtonStyle} onClick={() => navigate('/dashboard')}>Account</button>
            <button style={navButtonStyle} onClick={() => {
              localStorage.removeItem('user');
              setUser(null);
              navigate('/');
            }}>Logout</button>
          </>
          )}
          <button style={navButtonStyle} onClick={toggleDarkMode}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </nav>
    </header>
  );
}

// Main Section for Language Toggle
function Home() {
  const { favorite, toggleLanguage } = useContext(LanguageContext);

  return (
    <div style={containerStyle}>
      <p style={styles.text}>
        Favorite programming language:{' '}
        <span style={styles.highlight}>
          {favorite.emoji} {favorite.name}
        </span>
      </p>
      <button onClick={toggleLanguage} style={buttonStyle}>
        🔁 Toggle Language
      </button>
    </div>
  );
}

// Signup Component
function Signup() {
  const { setUser } = useContext(LanguageContext);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password } = form;

    if (!username || !email || !password) {
      return setError('Please fill in all fields.');
    }

    if (!validateEmail(email)) {
      return setError('Enter a valid email.');
    }

    // Save user to "localStorage" as a fake DB
    localStorage.setItem('user', JSON.stringify({ username, email }));
    setUser({ username, email });
    setSuccess('Signup successful! Redirecting...');
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div style={containerStyle}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} style={inputStyle} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} style={inputStyle} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={inputStyle} />
        <button type="submit" style={buttonStyle}>Sign Up</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
}

// Login Component
function Login() {
  const { setUser } = useContext(LanguageContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const { email, password } = form;

    if (!email || !password) return setError('Please fill in all fields.');

    if (!savedUser || savedUser.email !== email) {
      return setError('User not found. Please sign up.');
    }

    // Fake password check (you can make this more advanced)
    if (password.length < 4) return setError('Invalid password. Try at least 4 characters.');

    setUser(savedUser);
    setSuccess('Login successful! Redirecting...');
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div style={containerStyle}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} style={inputStyle} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={inputStyle} />
        <button type="submit" style={buttonStyle}>Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
}

// Dashboard Component
function Dashboard() {
  const { user, setUser } = useContext(LanguageContext);
  const [profile, setProfile] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('profile'));
    return saved || {
      fullName: '',
      phone: '',
      address: '',
      profilePic: '',
    };
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ ...profile, profilePic: reader.result });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSave = () => {
    localStorage.setItem('profile', JSON.stringify(profile));
    alert('Profile saved!');
  };

  if (!user) return <p style={containerStyle}>Please log in to view your dashboard.</p>;

  return (
    <div style={containerStyle}>
      <h2>Your Dashboard</h2>
      {profile.profilePic && (
        <img src={profile.profilePic} alt="Profile" style={{ width: '120px', borderRadius: '50%', marginBottom: '20px' }} />
      )}
      <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: '15px' }} />
      <input name="fullName" placeholder="Full Name" value={profile.fullName} onChange={handleChange} style={inputStyle} />
      <input name="phone" placeholder="Phone Number" value={profile.phone} onChange={handleChange} style={inputStyle} />
      <input name="address" placeholder="Address" value={profile.address} onChange={handleChange} style={inputStyle} />
      <button onClick={handleSave} style={buttonStyle}>Save Profile</button>
    </div>
  );
}

// Footer Component
function Footer() {
  const { darkMode } = useContext(LanguageContext);
  
  return (
    <footer style={footerStyle}>
      <p>&copy; 2025 LanguageToggle. All rights reseverd</p>
      <p>Made with 💻 by Phathutshedzo Rakhunwana</p>
    </footer>
  );
}

const appStyle = (darkMode) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: darkMode ? '#2c3e50' : '#ecf0f1',
});

const headerStyle = (darkMode) => ({
  backgroundColor: darkMode ? '#34495e' : '#3498db',
  color: 'white',
  padding: '10px 0',
});

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 20px',
  alignItems: 'center',
};

const navActionsStyle = {
  display: 'flex',
  alignItems: 'center',
};

const navButtonStyle = {
  backgroundColor: '#2980b9',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '5px',
  margin: '0 5px',
  border: 'none',
  cursor: 'pointer',
};

const containerStyle = {
  textAlign: 'center',
  margin: '20px auto',
};

const styles = {
  text: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  highlight: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
};

const buttonStyle = {
  backgroundColor: '#3498db',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
};

const footerStyle = {
  padding: '10px',
  backgroundColor: '#34495e',
  color: 'white',
  textAlign: 'center',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const inputStyle = {
  marginBottom: '10px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);


export default App;