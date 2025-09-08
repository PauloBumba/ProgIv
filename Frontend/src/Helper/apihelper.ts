export class ApiErrorHelper {
  static extractErrorMessage(error: any): string {
    // ModelState ou validação (ex: errors: { campo: [ "msg1", "msg2" ] })
    if (error?.response?.data?.errors) {
      const mensagens = Object.values(error.response.data.errors)
        .flat()
        .join(" | ");
      return mensagens;
    }

    // Mensagem customizada do backend (ex: { message: "...", isSuccess: false })
    const mensagemBackend = error?.response?.data?.message || error?.data?.message;
    if (mensagemBackend) {
      return mensagemBackend;
    }

    // Mensagem de erro padrão do Axios ou rejectWithValue
    if (error?.message) {
      return error.message;
    }

    // Fallback genérico
    return "Erro inesperado. Tente novamente mais tarde.";
  }
}
