import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Imensaje } from '../Interfaces/imensaje.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  
  private itemsCollection: AngularFirestoreCollection<Imensaje>;
  public chats: Imensaje[] = [];
  public usuario: any = {};
  
  constructor(private afs: AngularFirestore, private afauth: AngularFireAuth) {
    
    afauth.authState.subscribe(user => {
      
      if(!user)
      {
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
      this.usuario.photo = user.photoURL;
    });
   }

   agregarMensaje(texto: string) : Promise<any> {
    
    let mensaje: Imensaje = {
      mensaje: texto,
      nombre: this.usuario.nombre,
      fecha: new Date().getTime(),
      uid: this.usuario.uid,
    };
    
    return this.itemsCollection.add(mensaje);
   }

   cargarMensajes() {
     this.itemsCollection = this.afs.collection<Imensaje>('chats', query => query
                                                                                 .orderBy('fecha', 'desc')
                                                                                 .limit(5) );
     
     return this.itemsCollection.valueChanges().pipe(
      map( (mensajes: any[] ) => {
        this.chats = [];

        for (let mensaje of mensajes){
          this.chats.unshift(mensaje)
        }

      return this.chats;

      }))
   }

   public login(proveedor: string): void
   {
     if(proveedor ==='Google')
     {
       this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
     }

     if(proveedor ==='Twitter')
     {
       this.afauth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
     }
   }

   public logout(): void
   {
     this.usuario = {};
    this.afauth.signOut();
   }
}
