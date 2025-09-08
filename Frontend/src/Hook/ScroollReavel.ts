import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';

// Defina um tipo para as opções de ScrollReveal
interface ScrollRevealOptions {
  origin?: string;
  distance?: string;
  duration?: number;
  delay?: number;
  reset?: boolean;
}

const useScrollReveal = (selector: string, options: ScrollRevealOptions = {}) => {
  useEffect(() => {
    // Inicialize o ScrollReveal com a configuração fornecida
    const animacao = ScrollReveal();

    // Aplique a animação ao elemento com o seletor fornecido
    animacao.reveal(selector, {
      origin: 'left',
      distance: '30%',
      duration: 2000,
      delay: 250,
      reset: true,
      ...options, // Combina as opções padrão com as passadas como argumento
    });

    // Cleanup: destrói o ScrollReveal ao desmontar o componente
    return () => {
      animacao.destroy();
    };
  }, [selector, options]); // Dependências: reexecuta o efeito se o seletor ou as opções mudarem
};

export default useScrollReveal;
