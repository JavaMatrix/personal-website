import './App.css';
import Dropdown from './Dropdown';

function App() {
  console.log("ayo " + (new Date()).getMinutes() + ":" + (new Date()).getSeconds());
  return (
    <div className="App">
      <script src="matrix-sparks.js"></script>
      <header className="App-header">
        <main className="Title-box">
          <h1 className="Main-title">Nathanael Page</h1>
          <nav className="sections">
            <Dropdown header="Software" /><span> ⸱ </span>
            <Dropdown header="Music" /><span> ⸱ </span>
            <Dropdown header="Christianity" /><span> ⸱ </span>
            <a class="nav-header" href="https://nates.games/">Games</a>
          </nav>
        </main>
      </header>
    </div>
  );
}

export default App;
