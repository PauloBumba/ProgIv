
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Editor, type EditorTextChangeEvent } from "primereact/editor";
import {type  FC } from "react";
import { useState } from "react";

export const Feedback: FC = () => {
    const [rating, setRating] = useState<number | undefined>(undefined); // Alterado para number | undefined
    const [text, setText] = useState('');

    return (
        <div className="border-glass card text-center border-2 p-5 border-round-2xl layouts border-bottom-2 form-registers shadow-8 border">
            
                <h1 className="nav my-4">Feedback e Avaliação</h1>
                <p className="mx-2 mb-4 nav">
                    Sua opinião é muito importante para nós. Por favor, avalie nosso serviço e nos diga como podemos melhorar.
                </p>
                <h4 className="text-2xl destaque mb-2"> Avalie nosso serviço</h4>
                <div className="my-3 flex justify-content-center">
                    <div className="card ">
                        <div className="my-3 flex justify-content-center">
                            <Rating 
                                value={rating} 
                                onChange={(e) => setRating(e.value ?? undefined)} // Usando o operador de coalescência nula
// Atualização do valor diretamente
                                cancelIcon={<img src="https://primefaces.org/cdn/primereact/images/rating/cancel.png" alt="custom-cancel-image" width="25px" height="25px" />}
                                onIcon={<img src="https://primefaces.org/cdn/primereact/images/rating/custom-icon-active.png" alt="custom-image-active" width="25px" height="25px" />}
                                offIcon={<img src="https://primefaces.org/cdn/primereact/images/rating/custom-icon.png" alt="custom-image" width="25px" height="25px" />}
                            />
                        </div>
                        <div className="flex justify-content-center">
                            <form action="" method="post" aria-required>
                                <div className="card bg-white">
                                    <Editor value={text} onTextChange={(e: EditorTextChangeEvent) => setText(e.delta)} style={{ height: '320px' }} required className="w-12 "/>
                                </div>

                                <div className="mt-3">
                                    <Button label="Enviar Avaliação" className="p-button-mobile lg:w-4 " type="submit" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
           
        </div>
    );
};
