import { api } from '../Api/api'; // seu axios configurado

export const expenseReportService = {
  generateReport: (payload: {
    collaboratorIds?: string[];
    startDate: string;
    endDate: string;
    reportType: string;
  }) => api.post('/ExpenseReport', payload),
};
