import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import { expenseRequestService } from '../../../Services/expenseRequestService';

interface CreateExpenseForm {
  title: string;
  description: string;
  amount: number;
  date: Date;
  expenseTypeId: string;
  proofFile?: File | null;
}

interface ErrorResponse {
  [key: string]: string[];
}

const expenseTypeOptions = [
  { label: 'Alimentação', value: 'Alimentacao' },
  { label: 'Transporte', value: 'Transporte' },
  { label: 'Hospedagem', value: 'Hospedagem' },
  { label: 'Outros', value: 'Outros' },
];

export const CreateExpense: React.FC = () => {
  const [form, setForm] = useState<CreateExpenseForm>({
    title: '',
    description: '',
    amount: 0,
    date: new Date(),
    expenseTypeId: '',
    proofFile: null,
  });

  const [errors, setErrors] = useState<ErrorResponse>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const messagesRef = useRef<Messages>(null);
  const fileUploadRef = useRef<FileUpload>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    messagesRef.current?.clear();
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);

    // Validação front-end: arquivo obrigatório
    if (!form.proofFile) {
      setSubmitError('O comprovante é obrigatório.');
      return;
    }

    const formData = new FormData();
    formData.append('Title', form.title);
    formData.append('Description', form.description);
    formData.append('Amount', form.amount.toString());
    formData.append('ExpenseDate', form.date.toISOString());
    formData.append('Type', form.expenseTypeId);
    formData.append('ProofFile', form.proofFile);

    try {
      const response = await expenseRequestService.create(formData);

      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess('Despesa criada com sucesso!');
        messagesRef.current?.show([
          {
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Despesa criada com sucesso!',
          },
        ]);

        setForm({
          title: '',
          description: '',
          amount: 0,
          date: new Date(),
          expenseTypeId: '',
          proofFile: null,
        });

        fileUploadRef.current?.clear();
        setErrors({});
      } else {
        throw new Error('Erro ao criar despesa');
      }
    } catch (err: any) {
      const errorData = err?.response?.data;
      const apiErrors = errorData?.errors;

      if (apiErrors) {
        setErrors(apiErrors);

        const mensagens = Object.entries(apiErrors).flatMap(([campo, msgs]) =>
          msgs.map((msg) => ({
            severity: 'error',
            summary: campo,
            detail: msg,
          }))
        );

        messagesRef.current?.show(mensagens);
      } else {
        const msg =
          errorData?.message || 'Erro inesperado ao criar despesa';

        setSubmitError(msg);
        messagesRef.current?.show([
          {
            severity: 'error',
            summary: 'Erro',
            detail: msg,
          },
        ]);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (process.env.NODE_ENV === 'development') {
        console.error('Erro completo:', err);
      }
    }
  };

  return (
    <div className="card p-fluid">
      {/* Banner de erro */}
      {submitError && (
        <div className="mb-3">
          <Message
            severity="error"
            text={submitError.replaceAll(' | ', '\n')}
            style={{ whiteSpace: 'pre-line' }}
            closable
            onClick={() => setSubmitError(null)}
          />
        </div>
      )}

      {/* Banner de sucesso */}
      {submitSuccess && (
        <div className="mb-3">
          <Message
            severity="success"
            text={submitSuccess}
            closable
            onClick={() => setSubmitSuccess(null)}
          />
        </div>
      )}

      {/* Mensagens específicas de erro de campo */}
      <Messages ref={messagesRef} />

      <h2>Criar Nova Despesa</h2>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Título</label>
          <InputText
            id="title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className={errors.Title ? 'p-invalid' : ''}
          />
        </div>

        <div className="field">
          <label htmlFor="description">Descrição</label>
          <InputText
            id="description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className={errors.Description ? 'p-invalid' : ''}
          />
        </div>

        <div className="field">
          <label htmlFor="amount">Valor (R$)</label>
          <InputNumber
            id="amount"
            value={form.amount}
            onValueChange={(e) =>
              setForm({ ...form, amount: e.value ?? 0 })
            }
            mode="currency"
            currency="BRL"
            locale="pt-BR"
            className={errors.Amount ? 'p-invalid' : ''}
          />
        </div>

        <div className="field">
          <label htmlFor="date">Data da Despesa</label>
          <Calendar
            id="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.value ?? new Date() })
            }
            showIcon
            dateFormat="yy-mm-dd"
          />
        </div>

        <div className="field">
          <label htmlFor="expenseTypeId">Tipo de Despesa</label>
          <Dropdown
            id="expenseTypeId"
            value={form.expenseTypeId}
            options={expenseTypeOptions}
            onChange={(e) =>
              setForm({ ...form, expenseTypeId: e.value })
            }
            placeholder="Selecione um tipo"
            className={errors.Type ? 'p-invalid' : ''}
          />
        </div>

        <div className="field">
          <label htmlFor="proofFile">Arquivo de Comprovante</label>
          <FileUpload
            ref={fileUploadRef}
            mode="basic"
            name="proofFile"
            chooseLabel="Selecionar"
            customUpload
            uploadHandler={(e) => {
              const file = e.files[0];
              const extensoesPermitidas = ['.jpg', '.jpeg', '.png', '.pdf'];
              const nomeArquivo = file.name.toLowerCase();
              const extensao = nomeArquivo.slice(
                nomeArquivo.lastIndexOf('.')
              );

              if (!extensoesPermitidas.includes(extensao)) {
                messagesRef.current?.show([
                  {
                    severity: 'error',
                    summary: 'Arquivo inválido',
                    detail:
                      'Só é permitido PDF, JPG, JPEG ou PNG.',
                  },
                ]);
                setForm({ ...form, proofFile: null });
              
                return;
              }

              setForm({ ...form, proofFile: file });
              
            }}
            className={errors.ProofFile ? 'p-invalid' : ''}
          />
        </div>

        <Button
          label="Salvar Despesa"
          icon="pi pi-save"
          type="submit"
          className="mt-2"
        />
      </form>
    </div>
  );
};
