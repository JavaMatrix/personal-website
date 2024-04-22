import './App.css';
import Dropdown from './components/Dropdown';
import ExternalLink from './components/ExternalLink';

function App() {
  return (
    <div className="App">
      <script src="matrix-sparks.js"></script>
      <header className="App-header">
        <main className="Title-box">
          <h1 className="Main-title">Nathanael Page</h1>
          <nav className="sections">
            <Dropdown header="Christian">
              <ExternalLink className="nav-menu-item" href="https://gsbcnh.org/">Granite State Baptist Church</ExternalLink>
              <ExternalLink className="nav-menu-item" href="https://www.youtube.com/@GraniteStateBaptistChurch">GSBC on YouTube</ExternalLink>
              <ExternalLink className="nav-menu-item" href="https://www.majestic-media.com/kjv.htm">God's Bridge to Eternal Life</ExternalLink>
            </Dropdown>
            <span>⸱</span>
            <Dropdown header="Developer" link="/software">
              <ExternalLink className="nav-menu-item" href="https://github.com/JavaMatrix">GitHub</ExternalLink>
              <ExternalLink className="nav-menu-item" href="https://editor.p5js.org/nathanael.o.page/sketches">p5.js</ExternalLink>
              <ExternalLink className="nav-menu-item" href="https://1drv.ms/b/s!AjqBgKgMnkdJj_Nad0_HSkJEewyENQ?e=4J80rG">Resume</ExternalLink>
              <ExternalLink className="nav-menu-item" href="https://nates.games/">Games (Coming Soon!)</ExternalLink>
            </Dropdown>
            <span>⸱</span>
            <Dropdown header="Composer" link="/music">
              <ExternalLink className="nav-menu-item" href="https://www.youtube.com/@nathanaelpage">YouTube</ExternalLink>
              <ExternalLink className="nav-menu-item" href="https://soundcloud.com/nate-lastname">SoundCloud</ExternalLink>
            </Dropdown>
          </nav>
        </main>
      </header>
    </div>
  );
}

export default App;
