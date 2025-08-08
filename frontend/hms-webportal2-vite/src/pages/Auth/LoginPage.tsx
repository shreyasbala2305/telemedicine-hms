// // File: src/pages/Login.tsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login } from '@/services/authService';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await login({ email, password });
//       localStorage.setItem('token', response.token);
//       navigate('/dashboard');
//     } catch (err) {
//       setError('Invalid credentials');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
//         <h2 className="text-xl font-semibold mb-4">Login</h2>
//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full mb-3 px-3 py-2 border rounded"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full mb-3 px-3 py-2 border rounded"
//         />
//         <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }


import LoginForm from '@/components/auth/LoginForm';

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <LoginForm />
    </div>
  );
}
