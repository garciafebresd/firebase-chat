import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

import { map } from 'rxjs/operators';
import { Mensaje } from '../interface/mensaje.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(private afs: AngularFirestore,
    public afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe(user => {

      console.log('estado del usuario', user);

      if (!user) {
        return;
      }
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  login(proveedor: string) {
    if (proveedor === 'google') {
      this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } else {
      this.afAuth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    }
  }
  logout() {
    this.usuario = {};
    this.afAuth.signOut();
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
      nombre: this.usuario.nombre,
      mensaje: this.usuario.uid,
      fecha: new Date().getTime()
    };

    return this.itemsCollection.add(mensaje);
  }
}

