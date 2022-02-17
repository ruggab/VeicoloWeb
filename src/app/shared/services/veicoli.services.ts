import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dizionario } from 'src/app/model/Dizionario';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VeicoliService {

  constructor(
    private http: HttpClient
  ) { }

 


  getListaDizionariByContesto(contesto: string){
    this.http.get<Dizionario[]>(`${environment.apiUrl}getListDizionario/${contesto}`);
    
  }
}
