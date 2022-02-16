import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { Gara } from 'src/app/model/Gara';

@Component({
  selector: 'app-creazione-gara',
  templateUrl: './creazione-gara.component.html',
  styleUrls: ['./creazione-gara.component.scss']
})
export class CreazioneGaraComponent implements OnInit {

  loading;
  loading2;
  loadingcsv;
  moduleLoading;
  cercaGaraForm : FormGroup;
  garaForm : FormGroup;
 
  
  listGara : Gara[] =[];
  submitted = false;
  
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr : ToastrService
  ) {

    
    this.cercaGaraForm = this.fb.group({
      codGara : [''],
      cig : [''],
      cup : [''],
      dec : [''],
      rup : ['']
    });


    

    this.garaForm = this.fb.group({
      id : [''],
      matricola : ['',Validators.required],
      cig : ['',Validators.required],
      cup : ['',Validators.required],
      dec : ['',Validators.required],
      rup : ['',Validators.required],
      idAcFin : ['',Validators.required],
    });
    

    
  }

  ngOnInit() {
    this.getListaGara();
  }

  get f() { return this.garaForm.controls; }

 
  getListaGara(){
    this.moduleLoading = true;
    this.http.get<Gara[]>(`${environment.apiUrl}getListGara`)
    .subscribe(
      res =>{
        console.log(res);
        if (res.length!==0) {
          this.listGara= res;
        } else {
          this.toastr.error('Nessuna Gara trovata!','Gara',{progressBar: false});
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
    this.http.get<Gara[]>(`${environment.apiUrl}getListGara`)
    .subscribe(
      res =>{
        console.log(res);
        if(res.length!==0) {
          this.listGara = res;
          this.downloadCSV(this.listGara);
          this.loadingcsv = false;
        } else{
          this.toastr.error('Nessuna gara trovata!','Gara',{progressBar: false});
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
      saveAs(blob, "lista-gare.csv");
    
  }


  cercaGara(){
    this.submitted = true;
    let  gara: Gara = new Gara();
    gara.codGara = this.cercaGaraForm.controls.codGara.value;
    gara.cig = this.cercaGaraForm.controls.cig.value;
    gara.cup = this.cercaGaraForm.controls.cup.value;
    gara.dec = this.cercaGaraForm.controls.dec.value;
    gara.rup = this.cercaGaraForm.controls.rup.value;
    if (this.cercaGaraForm.invalid) {
      return;
    }
    console.log(gara);
    this.loading=true;
    
    this.http.post<Gara[]>(`${environment.apiUrl}getListGaraByFilter`, gara).subscribe(
        res =>{
          console.log(res);
          if (res.length!==0) {
            this.listGara= res;
          } else {
            this.toastr.error('Nessun Gara trovata!','Gara',{progressBar: false});
          }
          this.loading=false;
        },
        err =>{
          console.log(err);        
          this.loading=false;
        }
      )
  }

  // salvaGara(){
  //     this.submitted = true;
  //     let Gara : Gara = new Gara();
  //     Gara.id = this.GaraForm.controls.id.value;
  //     Gara.matricola = this.GaraForm.controls.matricola.value;
  //     Gara.nominativoRef = this.GaraForm.controls.nominativoRef.value;
  //     Gara.mailRef = this.GaraForm.controls.mailRef.value;
  //     Gara.telRef = this.GaraForm.controls.telRef.value;
  //     if (this.GaraForm.invalid) {
  //       return;
  //     }
  //     console.log(Gara);
  //     this.loading2=true;
  //     this.http.post<GenerateGaraResponse>(`${environment.apiUrl}generateGara`, Gara).subscribe(res => {
  //       if(res){
  //           this.GaraGenerata = res.id;
  //           this.loading2=false;
  //           this.getListaAziende();
  //           this.toastr.success('Gara generata con successo!','Info',{progressBar: false});          
  //         } else {
  //           this.loading2=false;
  //           this.getListaAziende();
  //           this.toastr.error('Errore nella generazione dell\' Gara!','Errore',{progressBar: false});
  //         }
  //     }, err => {
  //       console.log(err);
  //       this.toastr.error('Errore nella generazione dell\' Gara!','Errore',{progressBar: false});
  //     })
  //      this.GaraForm.reset();
  //      this.modalService.dismissAll();
  // }

  


  // deleteGara(idGara){
  //   this.loading=true;
  //   this.http.get<Gara[]>(`${environment.apiUrl}deleteGara/${idGara}`)
  //   .subscribe(
  //     res =>{
  //       console.log(res);
  //       if (res.length!==0) {
  //         this.listGara= res;
  //         this.toastr.success('Gara eliminata con successo!','Lista Aziende aggiornata',{progressBar: false});
  //       } else {
  //         this.toastr.error('Nessun Gara trovata!','Gara',{progressBar: false});
  //       }
  //       this.loading=false;
  //     },
  //     err =>{
  //       console.log(err);        
  //       this.loading=false;
  //     }
  //   )
    
  // }

  openLg(content, gara) {
    if (gara != null) {
      this.garaForm.controls['id'].setValue(gara.id);
      this.garaForm.controls['codGara'].setValue(gara.codGara);
      this.garaForm.controls['cup'].setValue(gara.cup);
      this.garaForm.controls['cig'].setValue(gara.cig);
      this.garaForm.controls['rup'].setValue(gara.rup);
      this.garaForm.controls['dec'].setValue(gara.dec);
    }
   
    this.modalService.open(content, { ariaLabelledBy: 'modalsos', size: 'lg' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

  // open(content) {
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
  //   .result.then((result) => {
  //     console.log(result);
  //   }, (reason) => {
  //     console.log('Err!', reason);
  //   });
  // }

}




