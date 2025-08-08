import { useState } from 'react';
import { register } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err) {
      alert('Registration failed. Try again.');
    }
  };

  return (
    <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-96">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <input className="w-full border mb-4 p-2" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input className="w-full border mb-4 p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="w-full border mb-4 p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded" type="submit">Register</button>
    </form>
  );
}
