import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import ProjectDetails from './pages/ProjectDetails';

// Placeholder components until created
const NotFound = () => <div className="p-4">404 - Not Found</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Manager', 'Admin']} />}>
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/project/:id" element={<ProjectDetails />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['User', 'Manager', 'Admin']} />}>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/user" element={<UserDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
