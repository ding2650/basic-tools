import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CliboardWindow from './components/CliboardHistory';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CliboardWindow />} />
      </Routes>
    </Router>
  );
}
