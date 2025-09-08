import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

import { userService } from '../../../Services/userService';
import { ApiErrorHelper } from '../../../Helper/apihelper';

interface IUser {
  userId?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  sex: number;
  role: string;
}

export default function EditarUsuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<IUser>({
    fullName: '',
    email: '',
    phoneNumber: '',
    sex: 0,
    role: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null); // estado para mensagem sucesso

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userService.getUserById(id!);
        const userFromApi = res.data.data;

        setUser(prev => ({
          ...prev,
          userId: userFromApi.id,
          fullName: userFromApi.fullName,
          email: userFromApi.email,
          phoneNumber: userFromApi.phoneNumber,
        }));
      } catch {
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setError(null);
      setSubmitSuccess(null);

      const res = await userService.updateUser(id!, { ...user, userId: id! });
      // pega a mensagem de sucesso que veio do backend (supondo que venha em res.data.message)
      const successMessage = res.data?.message ;;
      setSubmitSuccess(successMessage);
      // se quiser redirecionar depois de um tempo, pode fazer assim:
      // setTimeout(() => navigate('/usuarios'), 2000);
    } catch (err: any) {
      setError(ApiErrorHelper.extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="card p-fluid">
      <h2 className="mb-3">Editar Usuário</h2>

      {error && (
        <div className="mb-3">
          <Message severity="error" text={error} closable />
        </div>
      )}

      {submitSuccess && (
        <div className="mb-3">
          <Message severity="success" text={submitSuccess} closable />
        </div>
      )}

      <div className="grid formgrid">
        <div className="field md:col-6 col-12">
          <label>Nome Completo</label>
          <InputText
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="field md:col-6 col-12">
          <label>Email</label>
          <InputText
            name="email"
            value={user.email}
            readOnly
          />
        </div>

        <div className="field md:col-6 col-12">
          <label>Telefone</label>
          <InputText
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="field md:col-6 col-12">
          <label>Sexo</label>
          <Dropdown
            name="sex"
            value={user.sex}
            onChange={(e) => setUser(prev => ({ ...prev, sex: e.value }))}
            options={[
              { label: 'Masculino', value: 0 },
              { label: 'Feminino', value: 1 }
            ]}
            placeholder="Selecione"
            required
          />
        </div>

        <div className="field md:col-6 col-12">
          <label>Tipo de Usuário</label>
          <Dropdown
            name="role"
            value={user.role}
            onChange={(e) => setUser(prev => ({ ...prev, role: e.value }))}
            options={[
              { label: 'Admin', value: 'Admin' },
              { label: 'Financial Analyst', value: 'FinancialAnalyst' },
              { label: 'Colaborador', value: 'Collaborator' }
            ]}
            placeholder="Selecione"
            required
          />
        </div>

        <div className="field md:col-6 col-12 flex align-items-end">
          <Button
            label={saving ? 'Salvando...' : 'Atualizar'}
            icon="pi pi-save"
            disabled={saving}
            onClick={handleUpdate}
            className="p-button-success"
          />
        </div>
      </div>
    </div>
  );
}
