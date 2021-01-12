import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {
  
  public mensaje: string ="";
  public elemento: any;
  public photo: string;
  
  constructor(public chatService: ChatService) {

    chatService.cargarMensajes().subscribe( () =>
    {
      setTimeout(() =>
      {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      },20);
   });

   this.photo = chatService.usuario.photo;
  }

  ngOnInit(): void {
    this.elemento = document.getElementById('app-mensajes');
  }

  enviar_msj(): void
  {
    
    if(this.mensaje.length === 0)
    {
      return;
    }

    this.chatService.agregarMensaje(this.mensaje)
                    .then(() => this.mensaje ="")
                    .catch((err) => console.log("error", err));
  }

}
