import  { useState, useEffect } from 'react';
import { Rating } from 'primereact/rating';

const testimonials_id_1 = [
  {
    img: "https://i.pravatar.cc/150?img=1",
    quote: "A plataforma xampz é incrível! Facilitou muito a organização dos nossos jogos universitários.",
    author: "Ana Silva"
  },
  {
    img: "https://i.pravatar.cc/150?img=2",
    quote: "Adorei a interface e a facilidade de uso. Recomendo para todos os organizadores de torneios.",
    author: "Carlos Pereira"
  },
  {
    img: "https://i.pravatar.cc/150?img=3",
    quote: "Excelente suporte e muitas funcionalidades úteis. Nossa equipe está muito satisfeita.",
    author: "Mariana Rocha"
  }
];

const testimonials_id_2 = [
  {
    img: "https://i.pravatar.cc/150?img=4",
    quote: "A xampz revolucionou a forma como organizamos nossos campeonatos. É uma ferramenta essencial.",
    author: "Lucas Fernandes"
  },
  {
    img: "https://i.pravatar.cc/150?img=5",
    quote: "Muito fácil de usar e com muitos recursos úteis. A xampz é a melhor plataforma que já utilizamos.",
    author: "Julia Souza"
  },
  {
    img: "https://i.pravatar.cc/150?img=6",
    quote: "Organizar torneios nunca foi tão fácil. A xampz tem tudo o que precisamos e mais.",
    author: "Fernando Lima"
  }
];

export const Depoimentos = () => {
  const [testimonial1, setTestimonial1] = useState(testimonials_id_1[0]);
  const [testimonial2, setTestimonial2] = useState(testimonials_id_2[0]);

  const [currentTestimonialIndex1, setCurrentTestimonialIndex1] = useState(0);
  const [currentTestimonialIndex2, setCurrentTestimonialIndex2] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex1((prevIndex) => (prevIndex + 1) % testimonials_id_1.length);
      setCurrentTestimonialIndex2((prevIndex) => (prevIndex + 1) % testimonials_id_2.length);
    }, 5000);

    setTestimonial1(testimonials_id_1[currentTestimonialIndex1]);
    setTestimonial2(testimonials_id_2[currentTestimonialIndex2]);

    return () => clearInterval(interval);
  }, [currentTestimonialIndex1, currentTestimonialIndex2]);

  return (
    <section className="mt-4 text-center ">
      <h3 className="text-2xl font-bold destaque nav">Depoimentos</h3>
      <p className="my-3 nav">O que nossos clientes falam sobre nós.</p>
      <div className="grid">
        <div className="col-12 md:col-6 ">
          <div className="dish shadow-8 p-4 bg-white ">
            <img src={testimonial1.img} alt={testimonial1.author} className="feedback-avatar border-circle" />
            <p className="feedback-text">{testimonial1.quote}</p>
            <p className="feedback-author">{testimonial1.author}</p>

            <div className='mx-auto'>
            <Rating value={5} readOnly cancel={false} />
            
              
            
              </div>
          </div>
        </div>
        <div className="col-12 md:col-6">
          <div className="card dish shadow-8 p-4 bg-white border-round">
            <img src={testimonial2.img} alt={testimonial2.author} className="feedback-avatar border-circle" />
            <p className="feedback-text">{testimonial2.quote}</p>
            <p className="feedback-author">{testimonial2.author}</p>
              <div className='text-center'>
              <Rating value={5} readOnly cancel={false}  className='text-center'/>
              </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};
