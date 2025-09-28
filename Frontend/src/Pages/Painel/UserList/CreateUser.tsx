import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { userService } from "../../../Services/userService";
import { ApiErrorHelper } from "../../../Helper/apihelper";
import { Password } from "primereact/password";

import { InputMask } from 'primereact/inputmask';
        
export const CriarUsuarioPage = () => {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    sex: 0, // 0 Masculino, 1 Feminino
    phoneNumber: "",
    cpf: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    function: 0, // enum numérico
    role: 0, // enum numérico
    addresses: [
      {
        city: "",
        country: "",
        federalstate: "",
        zipCode: "",
        district: "",
        numberHouse: ""
      }
    ]
  });

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDropdownChange = (name: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
const fetchAddressByCep = async (cep: string) => {
  try {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return; // só busca se tiver 8 dígitos

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (data.erro) return;

    setForm(prev => ({
      ...prev,
      addresses: [{
        ...prev.addresses[0],
        zipCode: cleanCep,
        district: data.bairro || "",
        city: data.localidade || "",
        federalstate: data.uf || "",
        country: "Brasil" // já preenche fixo
      }]
    }));
  } catch (err) {
    console.error("Erro ao buscar CEP:", err);
  }
};
  const handleAddressChange = (e: any) => {
  const { name, value } = e.target;

  setForm(prev => ({
    ...prev,
    addresses: [{ ...prev.addresses[0], [name]: value }] as any
  }));

  if (name === "zipCode") {
    const cleanCep = value.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      fetchAddressByCep(cleanCep);
    }
  }
};
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);

    const payload = {
      fullName: form.fullName,
      email: form.email,
      sex: form.sex,
      phoneNumber: form.phoneNumber,
      cpf: form.cpf.replace(/\D/g, ""),
      dateOfBirth: form.dateOfBirth,
      password: form.password,
      confirmPassword: form.confirmPassword,
      function: form.function,
      role: form.role,
      addresses: form.addresses.map(addr => ({
        city: addr.city,
        country: addr.country,
        federalstate: addr.federalstate,
        zipCode: addr.zipCode.replace(/\D/g, ""),
        district: addr.district,
        numberHouse: addr.numberHouse
      }))
    };

    try {
      const response = await userService.createUser(payload);

      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess("Usuário criado com sucesso!");
        // Limpa o formulário
        setForm({
          email: "",
          fullName: "",
          sex: 0,
          phoneNumber: "",
          cpf: "",
          dateOfBirth: "",
          password: "",
          confirmPassword: "",
          function: 0,
          role: 0,
          addresses: [
            {
              city: "",
              country: "",
              federalstate: "",
              zipCode: "",
              district: "",
              numberHouse: ""
            }
          ]
        });
        setErrors({});
        // Opcional: navega depois de 2s pra lista de usuários
        setTimeout(() => navigate("/usuarios"), 2000);
      } else {
        throw new Error("Erro ao criar usuário");
      }
    } catch (err: any) {
      const mensagem = ApiErrorHelper.extractErrorMessage(err);
      setSubmitError(mensagem);

      if (err?.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (process.env.NODE_ENV === "development") {
        console.error("Erro completo:", err);
      }
    }
  };

  const renderFieldError = (field: string) =>
    errors[field]?.map((err, idx) => (
      <small key={idx} className="p-error block">
        {err}
      </small>
    ));

  return (
    <div className="card p-fluid  glass p-2 border-round-2xl shadow-8 border">
      <h2 className="lg:mx-8 mb-3">Criar Novo Usuário</h2>

      {submitError && (
        <div className="mb-3">
          <Message
            severity="error"
            text={submitError.replace(" | ", "\n")}
            style={{ whiteSpace: "pre-line" }}
           
          />
        </div>
      )}

      {submitSuccess && (
        <div className="mb-3">
          <Message severity="success" text={submitSuccess} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid formgrid  ">
      
        <div className="field col-12 md:col-6">
          
          <label className="text-white">Email</label>
          <InputText name="email" value={form.email} onChange={handleChange} placeholder="Informa teu email"/>
          {renderFieldError("email")}
        </div>

        <div className="field col-12 md:col-6">
          <label>Nome Completo</label>
          <InputText name="fullName" value={form.fullName} onChange={handleChange}  placeholder="Confirma teu email"/>
          {renderFieldError("fullName")}
        </div>

        <div className="field col-12 md:col-4">
          <label>Sexo</label>
          <Dropdown
            name="sex"
            value={form.sex}
            onChange={(e) => handleDropdownChange("sex", e.value)}
            options={[
              { label: "Masculino", value: 0 },
              { label: "Feminino", value: 1 }
            ]}
            placeholder="Selecione"
          />
          {renderFieldError("sex")}
        </div>

        <div className="field col-12 md:col-4">
  <label htmlFor="cpf">CPF</label>
  <InputMask
    id="cpf"
    name="cpf"
    value={form.cpf}
    onChange={handleChange}
    mask="999.999.999-99"
    placeholder="000.000.000-00"
  />
  {renderFieldError("cpf")}
</div>


        <div className="field col-12 md:col-4">
          <label>Telefone</label>
          <InputText name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
          {renderFieldError("phoneNumber")}
        </div>

        <div className="field col-12 md:col-4">
          <label>Data de Nascimento</label>
          <InputText
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
          />
          {renderFieldError("dateOfBirth")}
        </div>

        <div className="field col-12 md:col-4">
          <label>Cargo / Função</label>
          <Dropdown
            name="function"
            value={form.function}
            onChange={(e) => handleDropdownChange("function", e.value)}
            options={[
              { label: "Diretor", value: 0 },
              { label: "Gerente", value: 1 },
              { label: "Supervisor", value: 2 },
              { label: "Analista", value: 3 },
              { label: "Desenvolvedor", value: 4 },
              { label: "Designer", value: 5 },
              { label: "Assistente", value: 6 },
              { label: "Estagiario", value: 7 },
              { label: "Auxiliar", value: 8 },
              { label: "Coordenador", value: 9 },
              { label: "Tecnico", value: 10 }
            ]}
            placeholder="Selecione"
            required
          />
          {renderFieldError("function")}
        </div>

        <div className="field col-12 md:col-4">
          <label>Função de Acesso</label>
         <Dropdown
  name="role"
  value={form.role}
  onChange={(e) => handleDropdownChange("role", e.value)}
  options={[
    { label: "Administrador", value: 0 },
    { label: "Analista Financeiro", value: 1 },
    { label: "Colaborador", value: 2 }
  ]}
  placeholder="Selecione o tipo de usuário"
  required
/>

          {renderFieldError("role")}
        </div>

        <div className="field col-12 md:col-6">
          <label>Senha</label>
          <Password
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          {renderFieldError("password")}
        </div>

        <div className="field col-12 md:col-6">
          <label>Confirmar Senha</label>
          <Password
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {renderFieldError("confirmPassword")}
        </div>

        <div className="col-12">
        
        </div>

       {[
        { name: "zipCode", label: "CEP" },
  { name: "country", label: "País" },
  { name: "federalstate", label: "Estado" },
  { name: "city", label: "Cidade" },
  { name: "district", label: "Bairro" },
  
  { name: "numberHouse", label: "Número" }
].map((field) => (
  <div key={ field ? field.name : ''} className="field col-12 md:col-4">
    <label>{field ? field.label : ''}</label>
    {field &&  field.name === "zipCode" ? (
      <InputMask
        name={field.name}
        mask="99999-999"
        value={form.addresses[0][field.name]}
        onChange={handleAddressChange}
      />
    ) : (
      <InputText
      name={field ? field.name : ''}

        value={field ? (form.addresses[0][field.name as keyof typeof form.addresses[0]] as string) : ''}

        onChange={handleAddressChange}
      />
    )}
  {field ? renderFieldError(`addresses[0].${field.name}`) : null}

  </div>
))}

        <div className="col-12 text-right">
          <Button
            type="submit"
            label="Criar"
            icon="pi pi-save"
            className="p-button-success"
          />
        </div>
      </form>
    </div>
  );
};
