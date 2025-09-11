import { api } from '../Api/api';

export interface Medication {
  id: string;
  name: string;
  strength: string;
  notes?: string;
  userId: string;
  schedules?: MedicationSchedule[];
}

export interface MedicationSchedule {
  id: string;
  medicationId: string;
  timeOfDay: string;
  enabled: boolean;
}

export interface MedicationHistory {
  id: string;
  medicationId: string;
  wasTaken: boolean;
  takenAt?: string;
}

export interface CreateMedicationDto {
  name: string;
  strength: string;
  notes?: string;
}

export interface UpdateMedicationDto {
  name: string;
  strength: string;
  notes?: string;
}

export interface CreateScheduleDto {
  timeOfDay: string;
  enabled: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

class MedicationService {
  private baseUrl = '/api/Medications';

  async getAll(): Promise<ApiResponse<Medication[]>> {
    try {
      const response = await api.get<ApiResponse<Medication[]>>(this.baseUrl);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar medicamentos');
    }
  }

  async getById(id: string): Promise<ApiResponse<Medication>> {
    try {
      const response = await api.get<ApiResponse<Medication>>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar medicamento');
    }
  }

  async create(data: CreateMedicationDto): Promise<ApiResponse<Medication>> {
    try {
      const response = await api.post<ApiResponse<Medication>>(this.baseUrl, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao criar medicamento');
    }
  }

  async update(id: string, data: UpdateMedicationDto): Promise<ApiResponse<Medication>> {
    try {
      const response = await api.put<ApiResponse<Medication>>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar medicamento');
    }
  }

  async delete(id: string): Promise<ApiResponse<string>> {
    try {
      const response = await api.delete<ApiResponse<string>>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar medicamento');
    }
  }

  async addSchedule(medicationId: string, data: CreateScheduleDto): Promise<ApiResponse<MedicationSchedule>> {
    try {
      const response = await api.post<ApiResponse<MedicationSchedule>>(
        `${this.baseUrl}/${medicationId}/schedule`, 
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao criar horário');
    }
  }

  async markTaken(scheduleId: string): Promise<ApiResponse<MedicationHistory>> {
    try {
      const response = await api.post<ApiResponse<MedicationHistory>>(
        `${this.baseUrl}/mark-taken/${scheduleId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao marcar medicamento como tomado');
    }
  }
}

export const medicationService = new MedicationService();