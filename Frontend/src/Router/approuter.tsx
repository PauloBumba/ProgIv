import { type FC } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../Root/RootReducer";

import { PublicLayot } from "../Layout/Public/public";
import { Main } from "../Layout/Private/dashbord";
import { PrivateRoute } from "./PrivateRouter";

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
import { AuthCallback } from "../Pages/Authentication/AuthCallback";
import { Profile } from "../Pages/Painel/profile";
import { HomePage } from "../Pages/Painel/homepage";
import { GenericList } from "../Pages/Painel/Medications/MedicationsList";
import { MedicationForm } from "../Pages/Painel/Medications/MedicationForm";
import { MedicationDetails } from "../Pages/Painel/Medications/edicationDetails";
import { MedicationSchedules } from "../Pages/Painel/Medications/MedicationSchedules";
import { CreateExpense } from "../Pages/Painel/Expense/CreateExpense";
import { ViewExpense } from "../Pages/Painel/Expense/ViewExpense";
import { MyExpense } from "../Pages/Painel/Expense/myExpense";
import ListaUsuarios from "../Pages/Painel/UserList";
import { CriarUsuarioPage } from "../Pages/Painel/UserList/CreateUser";
import EditarUsuarioPage from "../Pages/Painel/UserList/EditarUsuario";

import { ScheduleList } from "../Pages/Painel/Schedules/ScheduleList";
import { ScheduleListWrapper } from "../Helper/ScheduleList";
import { SuportPrivate } from "../Pages/Painel/Suport";

import { RouteWatcher } from "./RouteWatcher";


interface AppUser {
  id: string;
  username: string;
  roles: string[];
}

export const AppRouter: FC = () => {
  const currentUser = useSelector((state: RootState) => state.users.user) as AppUser | null;

  return (
    <Router>
       <RouteWatcher />
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
          <Route path="Auth/callback" element ={<AuthCallback/>} />
          <Route path="acesso-negado" element={<AccessDenied />} />
          <Route path="usuarios/criar" element={<CriarUsuarioPage />} />
          <Route path="*" element={<Navigate to="/acesso-negado" replace />} />
        </Route>

        {/* Rotas privadas */}
        <Route element={<PrivateRoute><Main /></PrivateRoute>}>
          <Route index path="dashboard" element={<HomePage />} />
          <Route path="profile" element={<Profile />} />

          {/* Medicamentos */}
          <Route path="medications/list" element={<GenericList/>} />
          <Route path="medications/new" element={<MedicationForm />} />
          <Route path="medications/:id/edit" element={<MedicationForm />} />
          <Route path="medications/:id/schedules" element={<MedicationSchedules />} />
          <Route path="medications/:id" element={<MedicationDetails />} />

          {/* Despesas */}
          <Route path="expense/create" element={<CreateExpense />} />
          <Route path="expense/view" element={<ViewExpense />} />
          <Route path="expense/my" element={<MyExpense />} />

          {/* Usuários */}
          <Route path="usuarios" element={<ListaUsuarios />} />
          <Route path="usuarios/editar/:id" element={<EditarUsuarioPage />} />

          <Route path="*" element={<Navigate to="/acesso-negado" replace />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="medications/:id/schedules/list" element={<ScheduleListWrapper />} />
         <Route path="private/suport" element={<SuportPrivate />} />

        </Route>
      </Routes>
    </Router>
  );
};
