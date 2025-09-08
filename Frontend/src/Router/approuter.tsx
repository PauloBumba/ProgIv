import { type FC } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../Root/RootReducer";

import { PublicLayot } from "../Layout/Public/public";
import { Main } from "../Layout/Private/dashbord";
import { PrivateRoute } from "./PrivateRouter";
import { Roles } from "../Constants/roles";

// Páginas públicas
import { Index } from "../Pages/Common/home";
import { About } from "../Pages/Common/About";
import { Login } from "../Pages/Authentication/login";
import { Reset } from "../Pages/Authentication/Forgot";
import { Feedback } from "../Pages/Common/feedback";
import { RecoverToPassword } from "../Pages/Authentication/RecoverPassword";
import { ForgotToPassordSucess } from "../Pages/Authentication/Forgot-Sucess";
import { RecoverToPassordSucess } from "../Pages/Authentication/Recover-sucess";
import { Suport } from "../Pages/Common/suport";
import AccessDenied from "../Pages/Authentication/AccessDenied";
import PasswordRecoveryOTP from "../Pages/Authentication/ConfirmPassword";

// Páginas privadas
import { Profile } from "../Pages/Painel/profile";
import { HomePage } from "../Pages/Painel/homepage";

import { ExpenseRequestList } from "../Pages/Painel/expenseRequeList";
import ExpenseReportPage from "../Pages/Painel/UserTableWithExport";
import ListaUsuarios from "../Pages/Painel/UserList";
import { CriarUsuarioPage } from "../Pages/Painel/UserList/CreateUser";
import EditarUsuarioPage from "../Pages/Painel/UserList/EditarUsuario";
import { CreateExpense } from "../Pages/Painel/Expense/CreateExpense";
import { ViewExpense } from "../Pages/Painel/Expense/ViewExpense";
import { MyExpense } from "../Pages/Painel/Expense/myExpense";

// Tipo do usuário (garanta que isso esteja consistente com seu store)
interface AppUser {
  id: string;
  username: string;
  roles: string[];
}

export const AppRouter: FC = () => {
  const currentUser = useSelector((state: RootState) => state.users.user) as AppUser | null;

  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route element={<PublicLayot />}>
          <Route index element={<Index />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot" element={<Reset />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="recover-password" element={<RecoverToPassword />} />
          <Route path="forgot-sucess" element={<ForgotToPassordSucess />} />
          <Route path="reset-sucess" element={<RecoverToPassordSucess />} />
          <Route path="otp" element={<PasswordRecoveryOTP />} />
          <Route path="suport" element={<Suport />} />
          <Route path="acesso-negado" element={<AccessDenied />} />
          <Route path="*" element={<Navigate to="/acesso-negado" replace />} />
        </Route>

        {/* Rotas privadas */}
        <Route element={<PrivateRoute><Main /></PrivateRoute>}>

          {/* Dashboard e perfil (qualquer autenticado) */}
          <Route index path="dashboard" element={<HomePage />} />
          <Route path="profile" element={<Profile />} />

          {/* Somente para Colaborador */}
        <Route
  path="expense"
  element={
    <PrivateRoute requiredRoles={[Roles.Collaborator, Roles.Admin]}>
      <CreateExpense />
    </PrivateRoute>
  }
/>


            
          

          {/* Somente para Admin */}
          <Route
            path="usuarios"
            element={
              <PrivateRoute requiredRoles={[Roles.Admin]}>
                <ListaUsuarios />
              </PrivateRoute>
            }
          />

          <Route
            path="usuarios/criar"
            element={
              <PrivateRoute requiredRoles={[Roles.Admin]}>
                <CriarUsuarioPage />
              </PrivateRoute>
            }
          />

          <Route
            path="usuarios/editar/:id"
            element={
              <PrivateRoute >
                <EditarUsuarioPage />
              </PrivateRoute>
            }
          />
      <Route
  path="myexpense"
  element={
    <PrivateRoute requiredRoles={[Roles.Collaborator]}>
      <MyExpense />
    </PrivateRoute>
  }
/>
          <Route
            path="expense"
            element={
              <PrivateRoute requiredRoles={[Roles.Admin , Roles.FinancialAnalyst]}>
                <ViewExpense />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};
