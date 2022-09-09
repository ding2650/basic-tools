import {
  Routes,
  Route,
  useNavigate,
  MemoryRouter as Router,
  Navigate,
} from 'react-router-dom';
import './styles/index.css';
import CliboardWindow from './components/CliboardHistory';
import CopyCard from './components/CopyCard';

const RouterElement = () => {
  const navigate = useNavigate();
  window.electron.ipcRenderer.on('openCard', () => {
    navigate('/card');
  });
  window.electron.ipcRenderer.on('openHistory', () => {
    navigate('/history');
  });

  return (
    <Routes>
      {/* <Route path="/" element={<Welcome />} /> */}
      <Route path="/history" element={<CliboardWindow />} />
      <Route path="/card" element={<CopyCard />} />
      <Route path="*" element={<Navigate to="/history" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <RouterElement />
    </Router>
  );
}
