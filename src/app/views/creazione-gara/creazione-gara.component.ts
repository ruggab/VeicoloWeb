import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { Gara } from 'src/app/model/Gara';
import { GenerateResponse } from 'src/app/model/GenerateResponse';
import { Dizionario } from 'src/app/model/Dizionario';

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
  listFinAcq : Dizionario[] = [];
 
  
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
      codGara : ['',Validators.required],
      cig : ['',Validators.required],
      cup : ['',Validators.required],
      dec : ['',Validators.required],
      rup : ['',Validators.required],
      idFinAcq : [null]
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

  getListaFinAcq(contesto: string){
    this.http.get<Dizionario[]>(`${environment.apiUrl}getListDizionario/${contesto}`)
    .subscribe(
      res =>{
        console.log(res);
        if (res.length!==0) {
          this.listFinAcq= res;
        } else {
          this.toastr.error('Nessuna Finanziamento trovato!','Finanziamento',{progressBar: false});
        }
      },
      err =>{
        console.log(err);   
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
    gara.drec = this.cercaGaraForm.controls.dec.value;
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

  salvaGara(){
      this.submitted = true;
      let gara : Gara = new Gara();
      gara.id = this.garaForm.controls.id.value;
      gara.codGara = this.garaForm.controls.codGara.value;
      gara.cup = this.garaForm.controls.cup.value;
      gara.cig = this.garaForm.controls.cig.value;
      gara.rup = this.garaForm.controls.rup.value;
      gara.drec = this.garaForm.controls.dec.value;
      gara.idFinAcq = this.garaForm.controls.idFinAcq.value;

      if (this.garaForm.invalid) {
        return;
      }
      console.log(gara);
      this.loading2=true;
      this.http.post<GenerateResponse>(`${environment.apiUrl}generateGara`, gara).subscribe(res => {
        if(res){
            //this.garaGenerata = res.id;
            this.loading2=false;
            this.getListaGara();
            this.toastr.success('Gara generata con successo!','Info',{progressBar: false});          
          } else {
            this.loading2=false;
            this.getListaGara();
            this.toastr.error('Errore nella generazione della Gara!','Errore',{progressBar: false});
          }
      }, err => {
        console.log(err);
        this.toastr.error('Errore nella generazione della Gara!','Errore',{progressBar: false});
      })
       this.garaForm.reset();
       this.modalService.dismissAll();
  }

  


  deleteGara(idGara){
    this.loading=true;
    this.http.get<Gara[]>(`${environment.apiUrl}deleteGara/${idGara}`)
    .subscribe(
      res =>{
        console.log(res);
        if (res.length!==0) {
          this.listGara= res;
          this.toastr.success('Gara eliminata con successo!','Lista Gare aggiornata',{progressBar: false});
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

  openLg(content, gara) {
    this.getListaFinAcq('FIN_ACQ');
    //
    this.garaForm.controls['id'].setValue('');
    this.garaForm.controls['codGara'].setValue('');
    this.garaForm.controls['cup'].setValue('');
    this.garaForm.controls['cig'].setValue('');
    this.garaForm.controls['rup'].setValue('');
    this.garaForm.controls['dec'].setValue('');
    this.garaForm.controls['idFinAcq'].setValue(null);
    if (gara != null) {
      this.garaForm.controls['id'].setValue(gara.id);
      this.garaForm.controls['codGara'].setValue(gara.codGara);
      this.garaForm.controls['cup'].setValue(gara.cup);
      this.garaForm.controls['cig'].setValue(gara.cig);
      this.garaForm.controls['rup'].setValue(gara.rup);
      this.garaForm.controls['dec'].setValue(gara.drec);
      this.garaForm.controls['idFinAcq'].setValue(gara.idFinAcq);
    }
   
    this.modalService.open(content, { ariaLabelledBy: 'modalsos', size: 'lg' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

 

}




