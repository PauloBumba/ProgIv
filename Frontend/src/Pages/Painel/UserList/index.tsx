// src/pages/usuarios/index.tsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

import { userService } from '../../../Services/userService';
import {type IUser } from '../Components/Types';
import {type RootState } from '../../../Root/RootReducer';
import { useSelector } from 'react-redux';

export default function ListaUsuarios() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const toast = useRef<Toast>(null);
  const currentUser= useSelector((state: RootState) => state.users.user);
  const navigate = useNavigate();
const fetchUsers = async () => {
  try {
    const res = await userService.getAllUsers();
    const allUsers = res.data.data;

    // Filtra de acordo com a role
    if (currentUser?.role === 'Admin') {
      setUsers(allUsers);
    } else {
      // usuário normal só vê ele mesmo
      setUsers(allUsers.filter((u: IUser) => u.id === currentUser?.id));
    }
  } catch (err: any) {
    setError(err.response?.data?.message || 'Erro ao buscar usuários');
  }
};

useEffect(() => {
  fetchUsers();
}, [currentUser]);

  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuário deletado' });
    } catch (err: any) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar' });
    }
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: 'Tem certeza que deseja deletar?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDelete(id),
    });
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      {error && <Message severity="error" text={error} />}
      <ConfirmDialog />

      <div className="flex justify-content-between align-items-center mb-3">
        <h2>Usuários</h2>
        <div className="flex gap-2">
          <InputText
            placeholder="Buscar..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <Button label="Criar" icon="pi pi-plus" onClick={() => navigate('/usuarios/criar')} />
        </div>
      </div>

      <DataTable value={users} paginator rows={10} globalFilter={globalFilter} emptyMessage="Nenhum usuário.">
        <Column field="fullName" header="Nome" sortable />
        <Column field="email" header="Email" sortable />
        <Column
          header="Ações"
          body={(rowData: IUser) => (
            <div className="flex gap-2">
              <Button icon="pi pi-pencil" className="p-button-warning" onClick={() => navigate(`/usuarios/editar/${rowData.id}`)} />
              <Button icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDelete(rowData.id!)} />
            </div>
          )}
        />
      </DataTable>
    </div>
  );
}
