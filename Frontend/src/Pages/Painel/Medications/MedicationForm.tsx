import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';

import { medicationService } from "../../../Services/medicationService"

interface FormData {
  name: string;
  strength: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  strength?: string;
  notes?: string;
}

export const MedicationForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    strength: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  
  const isEditMode = !!id;
  const pageTitle = isEditMode ? 'Editar Medicamento' : 'Novo Medicamento';

  useEffect(() => {
    if (isEditMode) {
      loadMedication();
    }
  }, [id]);

  const loadMedication = async () => {
    if (!id) return;
    
    setInitialLoading(true);
    try {
      const response = await medicationService.getById(parseInt(id) || 0);
      if (response.data.success as boolean) {
        const medication = response.data;
        setFormData({
          name: medication.name,
          strength: medication.strength,
          notes: medication.notes || ''
        });
      } else {
        showToast('error', 'Erro', 'Medicamento não encontrado');
        navigate('/medications');
      }
    } catch (error: any) {
      showToast('error', 'Erro', error.message);
      navigate('/medications');
    } finally {
      setInitialLoading(false);
    }
  };

  const showToast = (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do medicamento é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.strength.trim()) {
      newErrors.strength = 'Concentração é obrigatória';
    } else if (formData.strength.trim().length < 2) {
      newErrors.strength = 'Concentração deve ter pelo menos 2 caracteres';
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Observações não podem exceder 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro específico quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('warn', 'Atenção', 'Corrija os erros no formulário');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        name: formData.name.trim(),
        strength: formData.strength.trim(),
        notes: formData.notes.trim() || undefined
      };

      const response = isEditMode 
        ? await medicationService.update(id ? parseInt(id) : 0, submitData)
        : await medicationService.create(submitData);

      if ( response.data.success) {
        showToast('success', 'Sucesso', 
          isEditMode ? 'Medicamento atualizado com sucesso' : 'Medicamento criado com sucesso'
        );
        setTimeout(() => navigate('/medications'), 1500);
      } else {
        showToast('error', 'Erro', 'Falha ao salvar medicamento');
      }
    } catch (error: any) {
      showToast('error', 'Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/medications');
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex align-items-center justify-content-center" 
           style={{ background: 'linear-gradient(135deg, #0062A8 0%, #00C896 100%)' }}>
        <Card className="text-center p-4">
          <ProgressSpinner aria-setsizee="50" strokeWidth="4" />
          <p className="mt-3 text-gray-600">Carregando medicamento...</p>
        </Card>
      </div>
    );
  }

  const header = (
    <div className="flex align-items-center justify-content-between">
      <div className="flex align-items-center gap-3">
        <div className="w-3rem h-3rem border-circle flex align-items-center justify-content-center"
             style={{ backgroundColor: isEditMode ? '#0062A8' : '#00C896', color: 'white' }}>
          <i className={`pi ${isEditMode ? 'pi-pencil' : 'pi-plus'} text-lg`}></i>
        </div>
        <div>
          <h2 className="m-0 text-2xl" style={{ color: '#003F7D' }}>
            {pageTitle}
          </h2>
          <p className="m-0 text-gray-600 text-sm">
            {isEditMode ? 'Atualize as informações do medicamento' : 'Cadastre um novo medicamento no sistema'}
          </p>
        </div>
      </div>
      <Button
        icon="pi pi-times"
        outlined
        size="small"
        tooltip="Fechar"
        tooltipOptions={{ position: 'left' }}
        onClick={handleCancel}
        style={{ borderColor: '#666', color: '#666' }}
      />
    </div>
  );

  return (
    <div className="min-h-screen p-4" 
         style={{ background: 'linear-gradient(135deg, #0062A8 0%, #00C896 100%)' }}>
      
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          {header}
          
          <Divider />
          
          <form onSubmit={handleSubmit} className="grid">
            <div className="col-12 md:col-6">
              <div className="field">
                <label htmlFor="name" className="block font-medium mb-2" style={{ color: '#003F7D' }}>
                  <i className="pi pi-heart mr-2"></i>
                  Nome do Medicamento *
                </label>
                <InputText
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Paracetamol, Dipirona..."
                  className={`w-full ${errors.name ? 'p-invalid' : ''}`}
                  maxLength={100}
                />
                {errors.name && (
                  <small className="p-error block mt-1">{errors.name}</small>
                )}
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="field">
                <label htmlFor="strength" className="block font-medium mb-2" style={{ color: '#003F7D' }}>
                  <i className="pi pi-tag mr-2"></i>
                  Concentração/Dosagem *
                </label>
                <InputText
                  id="strength"
                  value={formData.strength}
                  onChange={(e) => handleInputChange('strength', e.target.value)}
                  placeholder="Ex: 500mg, 20mg/ml..."
                  className={`w-full ${errors.strength ? 'p-invalid' : ''}`}
                  maxLength={50}
                />
                {errors.strength && (
                  <small className="p-error block mt-1">{errors.strength}</small>
                )}
              </div>
            </div>

            <div className="col-12">
              <div className="field">
                <label htmlFor="notes" className="block font-medium mb-2" style={{ color: '#003F7D' }}>
                  <i className="pi pi-file-edit mr-2"></i>
                  Observações
                  <span className="text-sm text-gray-500 ml-2">(Opcional)</span>
                </label>
                <InputTextarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Instruções especiais, contraindicações, observações gerais..."
                  className={`w-full ${errors.notes ? 'p-invalid' : ''}`}
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-content-between align-items-center mt-1">
                  {errors.notes && (
                    <small className="p-error">{errors.notes}</small>
                  )}
                  <small className="text-gray-400 ml-auto">
                    {formData.notes.length}/500 caracteres
                  </small>
                </div>
              </div>
            </div>

            <div className="col-12">
              <Message 
                severity="info" 
                text="Após criar o medicamento, você poderá configurar os horários de administração." 
                className="w-full"
              />
            </div>

            <div className="col-12">
              <Divider />
              <div className="flex justify-content-end gap-3 pt-3">
                <Button
                  label="Cancelar"
                  icon="pi pi-times"
                  outlined
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  style={{ borderColor: '#666', color: '#666' }}
                />
                <Button
                  label={isEditMode ? 'Atualizar' : 'Criar Medicamento'}
                  icon={`pi ${isEditMode ? 'pi-check' : 'pi-plus'}`}
                  type="submit"
                  loading={loading}
                  style={{ 
                    backgroundColor: isEditMode ? '#0062A8' : '#00C896', 
                    borderColor: isEditMode ? '#0062A8' : '#00C896' 
                  }}
                />
              </div>
            </div>
          </form>
        </Card>
      </div>

      <Toast ref={toast} />
    </div>
  );
};