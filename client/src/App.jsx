import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InputForm from './pages/InputForm';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputForm />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}