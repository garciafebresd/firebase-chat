import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';


import { map } from 'rxjs/operators';
import { Mensaje } from '../interface/mensaje.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];

  constructor(private afs: AngularFirestore,
    // tslint:disable-next-line: no-shadowed-variable
    public auth: AngularFireAuth) { }

  login(proveedor: string) {
    if (proveedor === 'google') {
      this.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
  }
  logout() {
    this.auth.signOut();
  }

  loadMessaje() {

    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc')
      .limit(5));
    return this.itemsCollection.valueChanges()
      .pipe(
        map((mensajes: Mensaje[]) => {

          this.chats = [];

          for (let mensaje of mensajes) {

            this.chats.unshift(mensaje);
          }
          return this.chats;
        })
      );
  }

  insertMessage(texto: string) {
    const mensaje: Mensaje = {
      nombre: 'DanielDemo',
      mensaje: texto,
      fecha: new Date().getTime()
    };

    return this.itemsCollection.add(mensaje);
  }
}

