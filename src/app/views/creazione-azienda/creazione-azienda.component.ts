import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { Azienda } from 'src/app/model/Azienda';
import { GenerateResponse } from 'src/app/model/GenerateResponse';

@Component({
  selector: 'app-creazione-azienda',
  templateUrl: './creazione-azienda.component.html',
  styleUrls: ['./creazione-azienda.component.scss']
})
export class CreazioneAziendaComponent implements OnInit {

  loading;
  loading2;
  loadingcsv;
  moduleLoading;
  cercaAziendaForm : FormGroup;
  aziendaForm : FormGroup;
 
  
  listAzienda : Azienda[] =[];
  esitoGenerazione;
  aziendaGenerata;
  submitted = false;
  
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr : ToastrService
  ) {

    
    this.cercaAziendaForm = this.fb.group({
      matricola : [''],
      nome : [''],
      nominativoRef : [''],
      mailRef : [''],
      telRef : ['']
    });

    this.aziendaForm = this.fb.group({
      id : [''],
      matricola : ['',Validators.required],
      nome : ['',Validators.required],
      nominativoRef : ['',Validators.required],
      mailRef : ['',Validators.required],
      telRef : ['']
    });
    

    
  }

  ngOnInit() {
    this.getListaAziende();
  }

  get f() { return this.aziendaForm.controls; }

 
  getListaAziende(){
    this.moduleLoading = true;
    this.http.get<Azienda[]>(`${environment.apiUrl}getListAzienda`)
    .subscribe(
      res =>{
        console.log(res);
        if (res.length!==0) {
          this.listAzienda= res;
        } else {
          this.toastr.error('Nessun Azienda trovata!','Azienda',{progressBar: false});
        }
        this.moduleLoading = false;
      },
      err =>{
        console.log(err);        
        this.moduleLoading = false;

      }
    )
  }

  exportCSV(){
    this.loadingcsv = true;
    this.http.get<Azienda[]>(`${environment.apiUrl}getListAzienda`)
    .subscribe(
      res =>{
        console.log(res);
        if(res.length!==0) {
          this.listAzienda = res;
          this.downloadCSV(this.listAzienda);
          this.loadingcsv = false;
        } else{
          this.toastr.error('Nessun documento trovato!','GIFT Document',{progressBar: false});
          this.loadingcsv = false;
        }
      },
      err =>{
        console.log(err);
      }
    )
  }

  downloadCSV(data: any){

      const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
      const header = Object.keys(data[0]);
      let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
      csv.unshift(header.join(';'));
      let csvArray = csv.join('\r\n');
  
      var blob = new Blob([csvArray], {type: 'text/csv' })
      saveAs(blob, "lista-aziende.csv");
    
  }


  cercaAzienda(){
    this.submitted = true;
    let azienda : Azienda = new Azienda();
    azienda.matricola = this.cercaAziendaForm.controls.matricola.value;
    azienda.nome = this.cercaAziendaForm.controls.nome.value;
    azienda.nominativoRef = this.cercaAziendaForm.controls.nominativoRef.value;
    azienda.mailRef = this.cercaAziendaForm.controls.mailRef.value;
    
    if (this.cercaAziendaForm.invalid) {
      return;
    }
    console.log(azienda);
    this.loading=true;
    
    this.http.post<Azienda[]>(`${environment.apiUrl}getListAziendaByFilter`, azienda).subscribe(
        res =>{
          console.log(res);
          if (res.length!==0) {
            this.listAzienda= res;
          } else {
            this.toastr.error('Nessun Azienda trovata!','Azienda',{progressBar: false});
          }
          this.loading=false;
        },
        err =>{
          console.log(err);        
          this.loading=false;
        }
      )
  }

  salvaAzienda(){
      this.submitted = true;
      let azienda : Azienda = new Azienda();
      azienda.id = this.aziendaForm.controls.id.value;
      azienda.matricola = this.aziendaForm.controls.matricola.value;
      azienda.nome = this.aziendaForm.controls.nome.value;
      azienda.nominativoRef = this.aziendaForm.controls.nominativoRef.value;
      azienda.mailRef = this.aziendaForm.controls.mailRef.value;
      azienda.telRef = this.aziendaForm.controls.telRef.value;
      if (this.aziendaForm.invalid) {
        return;
      }
      console.log(azienda);
      this.loading2=true;
      this.http.post<GenerateResponse>(`${environment.apiUrl}generateAzienda`, azienda).subscribe(res => {
        if(res){
            this.aziendaGenerata = res.id;
            this.loading2=false;
            this.getListaAziende();
            this.toastr.success('Azienda generata con successo!','Info',{progressBar: false});          
          } else {
            this.loading2=false;
            this.getListaAziende();
            this.toastr.error('Errore nella generazione dell\' Azienda!','Errore',{progressBar: false});
          }
      }, err => {
        console.log(err);
        this.toastr.error('Errore nella generazione dell\' Azienda!','Errore',{progressBar: false});
      })
       this.aziendaForm.reset();
       this.modalService.dismissAll();
  }


  deleteAzienda(idAzienda){
    this.loading=true;
    this.http.get<GenerateResponse>(`${environment.apiUrl}deleteAzienda/${idAzienda}`).subscribe(
      res =>{
        console.log(res);
        if (res) {
          this.loading=false;
          this.toastr.success('Azienda eliminata con successo!','Lista Aziende aggiornata',{progressBar: false});
          this.cercaAzienda();
        } else {
          this.loading=false;
          this.cercaAzienda();
        }
        this.loading=false;
      },
      err =>{
        console.log(err.error);    
        this.toastr.success(err.error,'Errore',{progressBar: false});    
        this.loading=false;
      }
    )
  }






  openLg(content, azienda) {
    if (azienda == null) {
      this.aziendaForm.controls['id'].setValue('');
      this.aziendaForm.controls['matricola'].setValue('');
      this.aziendaForm.controls['nome'].setValue('');
      this.aziendaForm.controls['nominativoRef'].setValue('');
      this.aziendaForm.controls['mailRef'].setValue('');
      this.aziendaForm.controls['telRef'].setValue('');
    }
    if (azienda != null) {
      this.aziendaForm.controls['id'].setValue(azienda.id);
      this.aziendaForm.controls['matricola'].setValue(azienda.matricola);
      this.aziendaForm.controls['nome'].setValue(azienda.nome);
      this.aziendaForm.controls['nominativoRef'].setValue(azienda.nominativoRef);
      this.aziendaForm.controls['mailRef'].setValue(azienda.mailRef);
      this.aziendaForm.controls['telRef'].setValue(azienda.telRef);
    }
   
    this.modalService.open(content, { ariaLabelledBy: 'modalsos', size: 'lg' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

  

}




