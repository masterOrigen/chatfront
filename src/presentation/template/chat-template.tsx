import { useState } from "react";
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../components";


interface Message{
  text: string;
  isGpt: boolean;
}


export const ChatTemplate = () => {

  const [IsLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async( text: string) => {
      setIsLoading(true);
      setMessages( (prev) => [...prev,{ text: text, isGpt:false }])

    //caso de uso TODO:UseCase
      setIsLoading(false);

    //todo: añadir mensaje de isGPT en true


  }


  return (
    <div className="chat-container">
      <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
             { /* Bienvenida del chat */ }
            <GptMessage text={"Soy la IA de Origen Medios, en que puedo ayudarte?"} />

            {
              messages.map( (message, index) =>(
                message.isGpt
                ?(
                  <GptMessage key={ index } text="Esto es de OpenAI" />
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
        placeholder="Escribe aquí tu pregunta."
        disableCorrections
        
        />

    </div>
  )
}
