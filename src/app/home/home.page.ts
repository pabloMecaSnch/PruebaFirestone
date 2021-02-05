import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Tarea } from '../tarea';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  arrayColeccionTareas: any =[{
    id: "",
    data:{} as Tarea
  }];
  tareaEditando: Tarea;
  idTareaSelec: string;

  constructor(private firestoreService: FirestoreService) {
    this.tareaEditando = {} as Tarea;
    this.obtenerListaTareas();
  }

  clickBotonInsertar(){
    console.log(this.tareaEditando);
    this.firestoreService.insertar("tareas",this.tareaEditando)
      .then(()=>{

      console.log("Tarea creada correctamente");
      this.tareaEditando = {} as Tarea;
      },(error)=>{
        console.error(error);
      });
  }
  obtenerListaTareas(){
    this.firestoreService.consultar("tareas").subscribe((resultadoConsultaTareas)=>{
      this.arrayColeccionTareas = [];
      resultadoConsultaTareas.forEach((datosTarea:any)=>{
        this.arrayColeccionTareas.push({
          id: datosTarea.payload.doc.id,
          data: datosTarea.payload.doc.data()
        });
      })
    });
  }
  selecTarea(tareaSelec){
    console.log("Tarea seleccionada:");
    console.log(tareaSelec);
    this.idTareaSelec = tareaSelec.id;
    this.tareaEditando.titulo = tareaSelec.data.titulo;
    this.tareaEditando.descripcion = tareaSelec.data.descripcion;
  }
  clickBotonBorrar(){
    this.firestoreService.borrar("tareas", this.idTareaSelec).then(()=>{
      this.obtenerListaTareas();
      this.tareaEditando = {} as Tarea;
    });
  }
  clickBotonModificar(){
    this.firestoreService.actualizar("tareas",this.idTareaSelec, this.tareaEditando).then(()=>{
      this.obtenerListaTareas();this.tareaEditando = {} as Tarea;
    });
  }

}
