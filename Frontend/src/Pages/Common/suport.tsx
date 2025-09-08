import { Button } from "primereact/button";

import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";

export const Suport = () => {
  return (
    <div className="text-center border-2 p-5 border-round-2xl layouts border-bottom-2 form-registers shadow-8 glass border">
     
         <h1 className="text-center nav my-3">Suporte e Contato</h1>
         <p className='nav mb-3'><strong></strong> Estamos aqui para ajudar! Entre em contato ou conecte-se conosco pelas redes sociais.</p>
        <div className="formgrid grid">
          {/* Formulário de Suporte */}
          <div className="col-12 md:col-7">
            <form action="" method="post">
              <div className="field">
                <InputText className="w-full" required placeholder="Nome Completo" />
              </div>
              <div className="field p-inputgroup">
                <span className="p-inputgroup-addon pi pi-envelope "></span>
                <InputText id="email" placeholder="exemplo@dominio.com" required className="w-full" />
              </div>
              <div className="field bg-white">
                <Editor style={{ height: "320px" , maxWidth: "1050px"}} className="" />
              </div>
              <div className="p-inputgroup">
                <Button label="Enviar Mensagem" className="w-full p-button-mobile"  />
              </div>
            </form>
          </div>

          {/* Redes Sociais */}
          <div className="col-12 md:col-5">
          <h2 className="my-3 nav">Conecte-se Conosco</h2>
          <p className="nav">Siga-nos nas redes sociais:</p>
          <div className="flex justify-content-center my-3">
  {/* Aumentando o tamanho dos ícones e aplicando as cores reais */}
  <span className="pi pi-facebook mx-2 text-3xl facebook"></span>
  <span className="pi pi-twitter mx-2 text-3xl twitter"></span>
  <span className="pi pi-instagram mx-2 text-3xl instagram"></span>
  <span className="pi pi-linkedin mx-2 text-3xl linkedin"></span>
  <span className="pi pi-youtube mx-2 text-3xl youtube"></span>
</div>
<span className="nav">Ou envie um email diretamente para</span>
{/* Alterando o link para direcionar ao e-mail */}
<div className="text-center ">

  <Link to="mailto:menuonline2025@gmail.com" className="email-link">
   <div className="yellow">paulomvbumba@gmail.com</div>
  </Link>
</div>


        </div>
        </div>
      
    </div>
  );
};
