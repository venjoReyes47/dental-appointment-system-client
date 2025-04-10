import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/admin/Navigation';
import routes from './routes';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.roleId !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-vh-100">
        <Navigation />
        <main>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  route.protected ? (
                    <ProtectedRoute requiredRole={route.requiredRole}>
                      {route.element}
                    </ProtectedRoute>
                  ) : (
                    route.element
                  )
                }
              />
            ))}
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
