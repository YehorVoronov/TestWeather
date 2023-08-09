import './App.css';
import CurrentCity from './CurrentCity/CurrentCity.tsx';
import Dashboard from './Dashboard/Dashboard.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';

import { Routes, Route } from 'react-router-dom';

const queryClient = new QueryClient();

function App() {
  return (  <QueryClientProvider client={queryClient}>
    <div className="App">
      <Routes>
        <Route path="/:cityName" element={<CurrentCity />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div></QueryClientProvider>
 
  );
}

export default App;
