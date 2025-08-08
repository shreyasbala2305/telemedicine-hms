import { useState } from 'react';
import { login } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard'); // adjust route as needed
    } catch (err) {
      alert('Login failed. Please check credentials.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input className="w-full border mb-4 p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="w-full border mb-4 p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" type="submit">Login</button>
    </form>
  );
}
