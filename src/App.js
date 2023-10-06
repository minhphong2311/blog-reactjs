import './App.css';
import { Routes, Route } from 'react-router-dom';
import Main from './layouts/Main';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoutes from './layouts/PrivateRoutes';
import PublicRoutes from './layouts/PublicRoutes';

function App() {
  return (
  <Routes>
    <Route element={<Main/>}>
      <Route element={<PrivateRoutes />}>
        <Route path='/' element={<Dashboard/>} />
      </Route>
    </Route>
    <Route element={<PublicRoutes />}>
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
    </Route>
  </Routes>
  );
}

export default App;
