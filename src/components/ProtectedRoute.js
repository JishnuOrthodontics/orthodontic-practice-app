import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

function ProtectedRoute({ allowedRoles }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const tokenResult = await currentUser.getIdTokenResult();
        console.log("Token Result:", tokenResult); // Add this line for debugging
        setUser({ ...currentUser, role: tokenResult.claims.role }); // Store the role
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;