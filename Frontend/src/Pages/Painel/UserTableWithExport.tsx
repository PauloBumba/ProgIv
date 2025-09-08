import { useEffect, useState, useRef } from 'react';
import { userService } from '../../../src/Services/userService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';

interface IUser {
  id?: string;
  name: string;
  email: string;
}

export default function UserList() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useRef<Toast>(null);

  // Buscar usuários no backend
  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers();
      setUsers(res.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar usuários');
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Confirmar exclusão
  const confirmDelete = (userId: string) => {
    confirmDialog({
      message: 'Tem certeza que deseja deletar este usuário?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDelete(userId),
    });
  };

  // Deletar usuário
  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuário deletado.' });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar usuário');
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error });
    }
  };

  // ABRIR MODAL PARA CRIAR — SEM NAVEGAR
  const openCreateModal = () => {
    setSelectedUser({ name: '', email: '' });
    setModalVisible(true);
  };

  // ABRIR MODAL PARA EDITAR — SEM NAVEGAR
  const openEditModal = (user: IUser) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  // FECHAR MODAL
  const hideModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
    setError(null);
  };

  // SALVAR USUÁRIO (CRIAR OU EDITAR)
  const handleSave = async () => {
    if (!selectedUser) return;

    if (!selectedUser.name.trim() || !selectedUser.email.trim()) {
      setError('Nome e email são obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      if (selectedUser.id) {
        // Atualizar usuário
        await userService.updateUser(selectedUser.id, selectedUser);
        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado.' });
      } else {
        // Criar usuário
        await userService.createUser(selectedUser);
        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado.' });
      }
      fetchUsers();
      hideModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar usuário');
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error });
    } finally {
      setSaving(false);
    }
  };

  // Botões AÇÃO (editar e deletar) — SEM link ou navigate, só modal e confirmação
  const actionBodyTemplate = (rowData: IUser) => {
    return (
      <div className="flex gap-2 justify-content-center">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          onClick={() => openEditModal(rowData)} // abrir modal editar aqui
          tooltip="Editar usuário"
          tooltipOptions={{ position: 'top' }}
          type="button" // só pra garantir que não faz submit
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDelete(rowData.id!)}
          tooltip="Deletar usuário"
          tooltipOptions={{ position: 'top' }}
          type="button"
        />
      </div>
    );
  };

  // Cabeçalho da tabela com busca e botão criar modal
  const header = (
    <div className="flex justify-content-between align-items-center">
      <h2>Lista de Usuários</h2>
      <div className="flex gap-3 align-items-center">
        <InputText
          type="search"
          placeholder="Buscar..."
          onInput={(e: any) => setGlobalFilter(e.target.value)}
          value={globalFilter}
          className="p-input-icon-left"
          style={{ maxWidth: 250 }}
        />
        <Button
          label="Criar Usuário"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={openCreateModal} // só abre modal, sem navegar!
          type="button"
        />
      </div>
    </div>
  );

  return (
    <div className="card">
      <Toast ref={toast} />
      {error && <Message severity="error" text={error} />}
      <ConfirmDialog />
      <DataTable
        value={users}
        paginator
        rows={10}
        header={header}
        globalFilter={globalFilter}
        emptyMessage="Nenhum usuário encontrado."
        responsiveLayout="scroll"
        stripedRows
      >
        <Column field="name" header="Nome" sortable filter filterPlaceholder="Buscar por nome" />
        <Column field="email" header="Email" sortable filter filterPlaceholder="Buscar por email" />
        <Column body={actionBodyTemplate} header="Ações" style={{ width: '10rem' }} />
      </DataTable>

      {/* Modal de criar/editar */}
      <Dialog
        visible={modalVisible}
        header={selectedUser?.id ? 'Editar Usuário' : 'Criar Usuário'}
        modal
        closable
        onHide={hideModal}
        footer={
          <>
            <Button label="Cancelar" icon="pi pi-times" onClick={hideModal} className="p-button-text" disabled={saving} type="button" />
            <Button label="Salvar" icon="pi pi-check" onClick={handleSave} disabled={saving} loading={saving} type="button" />
          </>
        }
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="name">Nome</label>
            <InputText
              id="name"
              value={selectedUser?.name || ''}
              onChange={(e) => setSelectedUser((prev) => (prev ? { ...prev, name: e.target.value } : null))}
              disabled={saving}
              required
            />
          </div>
          <div className="field mt-3">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              value={selectedUser?.email || ''}
              onChange={(e) => setSelectedUser((prev) => (prev ? { ...prev, email: e.target.value } : null))}
              disabled={saving}
              required
              type="email"
            />
          </div>
          {error && <Message severity="error" text={error} />}
        </div>
      </Dialog>
    </div>
  );
}
