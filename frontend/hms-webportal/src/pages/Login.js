export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <input className="w-full mb-4 p-2 border rounded" placeholder="Email" />
        <input className="w-full mb-4 p-2 border rounded" type="password" placeholder="Password" />
        <button className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600">
          Sign In
        </button>
      </form>
    </div>
  );
}
