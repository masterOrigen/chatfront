import { useEffect, useState } from "react";
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { createThreadUseCase, postQuestionUseCase } from "../../../core/use-cases";


interface Message{
  text: string;
  isGpt: boolean;
}


export const AssistantPage = () => {

  const [IsLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [threadId, setThreadId] = useState<string>();

  //obtener el thread, si no existe se crea uno nuevo
  useEffect(() => {
    const threadId = localStorage.getItem('threadId');
    if(threadId){
      setThreadId(threadId);
    }else{
      createThreadUseCase()
      .then( (id) => {
       setThreadId(id);
       localStorage.setItem('threadId', id);
      })
    }
  }, [])


 



  const handlePost = async( text: string) => {
      setIsLoading(true);
      setMessages( (prev) => [...prev,{ text: text, isGpt:false }]);

      const replies = await postQuestionUseCase(threadId, text);

    //caso de uso TODO:UseCase
      setIsLoading(false);

    //todo: añadir mensaje de isGPT en true
    for (const reply of replies) {
      for (const message of reply.content) {
        setMessages ( (prev) => [
          ...prev,
          { text: message, isGpt: (reply.role === 'assistant'), info: reply  }
        ] )
      }
    }

  }


  return (
    <div className="chat-container">
      <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
             { /* Bienvenida del chat */ }
            <GptMessage text={"!Hola¡ Soy la IA de Origen Medios, que puedo hacer por ti?"} />

            {
              messages.map( (message, index) =>(
                message.isGpt
                ?(
                  <GptMessage key={ index } text={ message.text } />
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