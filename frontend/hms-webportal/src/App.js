import logo from './logo.svg';
import './App.css';
import './output.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <div className="p-6 bg-indigo-600 text-white rounded-xl shadow-lg text-center">
      Tailwind CSS is working! 🎉
    </div>
    
    </div>
  );
}

export default App;
