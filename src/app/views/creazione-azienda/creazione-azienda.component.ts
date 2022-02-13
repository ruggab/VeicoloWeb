import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { Azienda } from 'src/app/model/Azienda';
import { GenerateAziendaResponse } from 'src/app/model/GenerateAziendaResponse';

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
  creaAziendaForm : FormGroup;
  updateAziendaForm: FormGroup;
  
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

    this.creaAziendaForm = this.fb.group({
      matricola : ['',Validators.required],
      nominativoRef : ['',Validators.required],
      mailRef : ['',Validators.required],
      telRef : ['']
    });
    //this.creaGiftForm.controls['language'].setValue(this.listLanguage[0], {onlySelf: true});
    this.updateAziendaForm= this.fb.group({
      matricola : ['',Validators.required],
      nominativoRef : ['',Validators.required],
      mailRef : ['',Validators.required],
      telRef : ['']
    });

    this.cercaAziendaForm = this.fb.group({
      matricola : ['',],
      nominativoRef : [''],
      mailRef : [''],
      telRef : ['']
    });
    
  }

  ngOnInit() {
    this.getListaAziende();
  }

  get f() { return this.creaAziendaForm.controls; }

 
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

  exportCSV(doc_number){
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
      saveAs(blob, "lista-gift.csv");
    
  }


  cercaAzienda(){
    this.submitted = true;
    let azienda : Azienda = new Azienda();
    azienda.matricola = this.cercaAziendaForm.controls.matricola.value;
    azienda.nominativoRef = this.cercaAziendaForm.controls.nominativoRef.value;
    azienda.mailRef = this.cercaAziendaForm.controls.mailRef.value;
    azienda.telRef = this.cercaAziendaForm.controls.telRef.value;
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

  creaAzienda(){
    this.submitted = true;
    let azienda : Azienda = new Azienda();
    azienda.matricola = this.creaAziendaForm.controls.matricola.value;
    azienda.nominativoRef = this.creaAziendaForm.controls.nominativoRef.value;
    azienda.mailRef = this.creaAziendaForm.controls.mailRef.value;
    azienda.telRef = this.creaAziendaForm.controls.telRef.value;
    if (this.creaAziendaForm.invalid) {
      return;
    }
    console.log(azienda);
    this.loading=true;
    this.http.post<GenerateAziendaResponse>(`${environment.apiUrl}generateAzienda`, azienda).subscribe(res => {
      if(res){
          this.aziendaGenerata = res.id;
          this.loading=false;
          this.getListaAziende();
          this.toastr.success('Azienda generata con successo!','Info',{progressBar: false});          
        } else {
          this.loading=false;
          this.getListaAziende();
          this.toastr.error('Errore nella generazione dell\' Azienda!','Errore',{progressBar: false});
        }
    }, err => {
      console.log(err);
      this.toastr.error('Errore nella generazione dell\' Azienda!','Errore',{progressBar: false});
    })
  }

  

  updateAzienda(){
   
    let aziendaUp : Azienda = new Azienda();
    aziendaUp.matricola = this.updateAziendaForm.controls.matricola.value;

    this.loading2=true;
    this.http.post<any>(`${environment.apiUrl}updateAzienda`, aziendaUp)
    .subscribe(
      res =>{
        this.loading2=false;
        //this.qta = qta;
        this.toastr.success('Quantità aggiornata con successo!','Quantità aggiornata',{progressBar: false});
      },
      err =>{
        console.log(err);
        this.loading2=false;
        this.toastr.error('Errore nell aggiornamento della quantità','Errore',{progressBar: false})
      }
    )
    
  }

  openLg(content, id_document) {

    this.modalService.open(content, { ariaLabelledBy: 'modalsos', size: 'lg' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log('Err!', reason);
    });
  }

}




