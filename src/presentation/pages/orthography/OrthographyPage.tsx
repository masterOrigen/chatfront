import { TypingLoader } from "../../components/loaders/TypingLoader";
import { GptMessage } from "../../components/chat-bubbles/GptMessage";
import { MyMessage } from "../../components/chat-bubbles/MyMessage";
import { TextMessageBox } from "../../components/chat-input-boxes/TextMessageBox";
import { useState } from "react";
import { orthographyUseCase } from "../../../core/use-cases";
import { GptOrthographyMessage } from "../../components";


interface Message{
  text: string;
  isGpt: boolean;
  info?:{
    userScore: number;
    errors: string[];
    message: string;
  }
}


export const OrthographyPage = () => {

  const [IsLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async( text: string) => {
      setIsLoading(true);
      setMessages( (prev) => [...prev,{ text: text, isGpt:false }]);

    //caso de uso TODO:UseCase
     const data = await orthographyUseCase( text );
     
     if( !data.ok ){
      setMessages( (prev) => [...prev,{ text: 'No se pudo obtener una respuesta.', isGpt:true }]);
     }else{
      setMessages( (prev) => [...prev,{
         text: data.message, isGpt:true,
         info:{
          errors: data.errors,
          message: data.message,
          userScore: data.userScore,
         }
         }]);
     }
     
     
     setIsLoading(false);

    //todo: añadir mensaje de isGPT en true


  }


  return (
    <div className="chat-container">
      <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
             { /* Bienvenida del chat */ }
            <GptMessage text={"Soy la IA de Origen Medios para corregir tu ortografía, que texto  deseas verificar?"} />

            {
              messages.map( (message, index) =>(
                message.isGpt
                ?(
                  <GptOrthographyMessage 
                  key={ index } 
                  { ...message.info! }
                  />
                )
                : (
                  <MyMessage key={ index } text={ message.text } />
                )
              ))
            }
            {
              IsLoading &&(
                <div className="col-start-1 col-end-12 fade-in">
            <TypingLoader />
            </div>
              )
            }
        

         </div>
      </div>

      <TextMessageBox 
        onSendMessage={ handlePost }
        placeholder="Escribe aquí el texto que necesitas corregir."
        disableCorrections
        
        />
      
    </div>
  )
}
