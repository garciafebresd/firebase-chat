import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

  mensaje = '';
  elemento: any;

  constructor(public chatService: ChatService) {

    this.chatService.loadMessaje()
      .subscribe(() => {
        setTimeout(() => {
          this.elemento.scrollTop = this.elemento.scrollHeight;
        }, 20);
      });
  }

  enviar_mensaje() {
    console.log(this.mensaje);

    if (this.mensaje.length === 0) {
      return;
    }

    this.chatService.insertMessage(this.mensaje)
      .then(() => this.mensaje = '')
      .catch((err) => console.error('Error al enviar mensaje', err));
  }

  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
  }

}
