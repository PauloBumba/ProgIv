// src/pages/usuarios/components/UserForm.tsx
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import {type IUser } from './Types';

interface Props {
  user: IUser;
  onChange: (user: IUser) => void;
  onSubmit: () => void;
  loading: boolean;
  error?: string | null;
}

export function UserForm({ user, onChange, onSubmit, loading, error }: Props) {
  return (
    <div className="p-fluid">
      <div className="field">
        <label htmlFor="name">Nome</label>
        <InputText
          id="name"
          value={user.name}
          onChange={(e) => onChange({ ...user, name: e.target.value })}
          disabled={loading}
        />
      </div>
      <div className="field mt-3">
        <label htmlFor="email">Email</label>
        <InputText
          id="email"
          value={user.email}
          type="email"
          onChange={(e) => onChange({ ...user, email: e.target.value })}
          disabled={loading}
        />
      </div>
      {error && <Message severity="error" text={error} />}
      <Button label="Salvar" icon="pi pi-check" onClick={onSubmit} loading={loading} className="mt-3" />
    </div>
  );
}
