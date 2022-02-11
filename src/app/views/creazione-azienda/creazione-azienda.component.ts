import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { GiftDocument } from 'src/app/model/GiftDocument';
import { ToastrService } from 'ngx-toastr';
import { GiftDocumentDetails } from 'src/app/model/GiftDocumentDetails';
import { GenerateGiftRequest } from 'src/app/model/GenerateGiftRequest';
import { GenerateGiftResponse } from 'src/app/model/GenerateGiftResponse';
import { GiftToExport } from 'src/app/model/GiftToExport';
import { saveAs } from 'file-saver';
import { UpdateQuantityRequest } from 'src/app/model/UpdateQuantityRequest';

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
  creaGiftForm : FormGroup;
  updateQtaForm: FormGroup;
  listLanguage : string[] = [];
  listDocument : GiftDocument[] =[];
  listDocumentsDetailGift$ : GiftDocumentDetails[] = [];
  listaGiftToExport : GiftToExport[] = [];
  esitoGenerazione;
  documentoGenerato;
  qta : number;
  submitted = false;
  
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr : ToastrService
  ) {

    this.creaGiftForm = this.fb.group({
      qtagift : ['',Validators.required],
      language : ['',Validators.required]
    });
    //this.creaGiftForm.controls['language'].setValue(this.listLanguage[0], {onlySelf: true});
    this.updateQtaForm= this.fb.group({
      qta :['',Validators.required]
    })
    
  }

  ngOnInit() {
    this.getDocuments();
    this.getLanguage();
    this.getQuantity();

  }

  get f() { return this.creaGiftForm.controls; }

  getLanguage(){
    this.http.get<any[]>(`${environment.apiUrl}giftcard/getlanguages`)
    .subscribe(
      res =>{
        console.log(res);
        this.listLanguage=res;

      },
      err =>{
        console.log(err);
      }
    )
  }

  getDocuments(){
    this.moduleLoading = true;
    this.http.get<GiftDocument[]>(`${environment.apiUrl}giftcard/getdocuments`)
    .subscribe(
      res =>{
        console.log(res);
        if (res.length!==0) {
          this.listDocument= res;
        } else {
          this.toastr.error('Nessun documento trovato!','GIFT Document',{progressBar: false});
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
    this.http.get<GiftToExport[]>(`${environment.apiUrl}giftcard/getgifttoexport/` + doc_number)
    .subscribe(
      res =>{
        console.log(res);
        if(res.length!==0) {
          this.listaGiftToExport= res;
          this.downloadCSV(this.listaGiftToExport);
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

  creaGift(){
    this.submitted = true;
    let generateGiftRequest : GenerateGiftRequest = new GenerateGiftRequest();

    generateGiftRequest.gift_qta = this.creaGiftForm.controls.qtagift.value;
    generateGiftRequest.gift_language = this.creaGiftForm.controls.language.value;

    if (this.creaGiftForm.invalid) {
      return;
    }
    console.log(generateGiftRequest);
    this.loading=true;
    this.http.post<GenerateGiftResponse>(`${environment.apiUrl}giftcard/generategift`, generateGiftRequest).subscribe(res => {
      console.log(res);
      if(res.esito === "OK"){
          this.documentoGenerato = res.n_documento;
          this.loading=false;
          this.getDocuments();
          this.toastr.success('Gift generate con successo!','Info',{progressBar: false});          
        } else {
          this.loading=false;
          this.getDocuments();
          this.toastr.error('Errore nella generazione delle GIFT!','Errore',{progressBar: false});
        }
     
    }, err => {
      console.log(err);
      this.toastr.error('Errore nella generazione delle GIFT!','Errore',{progressBar: false});
    })


  }

  getQuantity(){
    this.http.get<number>(`${environment.apiUrl}giftcard/getlotsize`)
    .subscribe(
      res =>{
        console.log(res);
        this.qta=res;
  
      },
      err =>{
        console.log(err);
      }
    )
  }

  updateQuantity(){
   
    let qta : number = this.updateQtaForm.controls.qta.value;
    let u : UpdateQuantityRequest = new UpdateQuantityRequest();
    u.qta = qta;

    this.loading2=true;
    this.http.post<any>(`${environment.apiUrl}giftcard/updatelotsize`, u)
    .subscribe(
      res =>{
        this.loading2=false;
        this.qta = qta;
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

    this.listDocumentsDetailGift$ = [];
    this.moduleLoading = true;
    console.log("id_document"+id_document)
    this.http.get<GiftDocumentDetails[]>(`${environment.apiUrl}giftcard/getdocumentsdetails/`+id_document).subscribe(res => {
      console.log(res);
      this.listDocumentsDetailGift$ = res;
      this.moduleLoading = false;
    }, err => {
      console.log(err);
      this.moduleLoading = false;

    });

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




