import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../Root/RootReducer';
interface PropsChildren {
  children: React.ReactNode;
}

export function AdminRoute({ children }: PropsChildren) {
  const userRole = useSelector((state: RootState) => state.users.user?.role);

  if (userRole !== 'Admin') {
    return <Navigate to="/unauthorized" />; // ou uma página "sem permissão"
  }

  return children;
}