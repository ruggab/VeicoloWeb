import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { GenerateResponse } from 'src/app/model/GenerateResponse';
import { Dizionario } from 'src/app/model/Dizionario';
import { Veicolo } from 'src/app/model/Veicolo';

@Component({
  selector: 'app-creazione-veicolo',
  templateUrl: './creazione-veicolo.component.html',
  styleUrls: ['./creazione-veicolo.component.scss']
})
export class CreazioneVeicoloComponent implements OnInit {

  loading;
  loading2;
  loadingcsv;
  moduleLoading;
  cercaVeicoloForm : FormGroup;
  veicoloForm : FormGroup;
  listFinAcq : Dizionario[] = [];
 
  
  listVeicolo : Veicolo[] =[];
  submitted = false;
  
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr : ToastrService
  ) {

    
    this.cercaVeicoloForm = this.fb.group({
      matricola : [''],
      telaio : [''],
      classe : new FormControl(null),
      alimentazione : new FormControl(null)

    });


    

    this.veicoloForm = this.fb.group({
      id : [''],
      matricola : ['',Validators.required],
      telaio : [''],
      numSimSerialNumber : [''],
      numSimTelefonico : [''],
      costoAcquistoNettoIva : [''],
      dataAggiornamento : [''],
      dataAttivazioneavm : [''],
      dataConsegnaAdAziendaTpl : [''],
      dataContrattoAziendaTpl : [''],
      dataInserimento : [''],
      dataPrimaImm : [''],
      dataScadGaranziaBase : [''],
      dataScadGaranziaEstesa : [''],
      dataScadUsufrutto : [''],
      dataScadVincolo : [''],
      dataUltimaRevisione : [''],
      depositoRicoveroProtComunicazione : [''],
      idUtente : [''],
      indirizzoDepositoRicovero: [''],
      kmDataRevisione: [''],
      lunghezza: [''],
      note: [''],
      numPorte: [''],
      targa1imm: [''], 
      utimaVerIspettiva: [''],
      assegnatario:new FormControl(null), 
      categoria: new FormControl(null),
      classe :new FormControl(null),
      dispCopiaCartaCirc : new FormControl(null),
      fornitore: new FormControl(null),
      modello: new FormControl(null),
      regimeProprieta: new FormControl(null),
      tipoAlimentazione: new FormControl(null),
      tipoAllestimento: new FormControl(null)
    });
    

    
  }

  ngOnInit() {
    this.getListaVeicolo();
   
  }

  get f() { return this.veicoloForm.controls; }

 
  getListaVeicolo(){
    this.moduleLoading = true;
    this.http.get<Veicolo[]>(`${environment.apiUrl}getListVeicolo`)
    .subscribe(
      res =>{
        console.log(res);
        if (res.length!==0) {
          this.listVeicolo= res;
        } else {
          this.toastr.error('Nessuna Veicolo trovato!','Veicolo',{progressBar: false});
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
    this.http.get<Veicolo[]>(`${environment.apiUrl}getListVeicolo`)
    .subscribe(
      res =>{
        console.log(res);
        if(res.length!==0) {
          this.listVeicolo = res;
          this.downloadCSV(this.listVeicolo);
          this.loadingcsv = false;
        } else{
          this.toastr.error('Nessun Veicolo trovato!','Veicolo',{progressBar: false});
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
      saveAs(blob, "lista-veicoli.csv");
    
  }


  cercaVeicolo(){
    this.submitted = true;
    let  veicolo: Veicolo = new Veicolo();
    veicolo.matricola = this.cercaVeicoloForm.controls.matricola.value;
    veicolo.telaio = this.cercaVeicoloForm.controls.telaio.value;
    veicolo.tipoAlimentazione = this.cercaVeicoloForm.controls.tipoAlimentazione.value;
    veicolo.classe = this.cercaVeicoloForm.controls.classe.value;
    if (this.cercaVeicoloForm.invalid) {
      return;
    }
    console.log(veicolo);
    this.loading=true;
    
    this.http.post<Veicolo[]>(`${environment.apiUrl}getListVeicoloByFilter`, veicolo).subscribe(
        res =>{
          console.log(res);
          if (res.length!==0) {
            this.listVeicolo= res;
          } else {
            this.toastr.error('Nessun Veicolo trovato!','Veicolo',{progressBar: false});
          }
          this.loading=false;
        },
        err =>{
          console.log(err);        
          this.loading=false;
        }
      )
  }

  salvaVeicolo(){
      this.submitted = true;
      let veicolo : Veicolo = new Veicolo();
      veicolo.id = this.veicoloForm.controls.id.value;
      veicolo.matricola = this.veicoloForm.controls.matricola.value;
      veicolo.telaio = this.veicoloForm.controls.telaio.value;
      veicolo.numSimSerialNumber = this.veicoloForm.controls.numSimSerialNumber.value;
      veicolo.numSimTelefonico = this.veicoloForm.controls.numSimTelefonico.value;
      veicolo.costoAcquistoNettoIva = this.veicoloForm.controls.costoAcquistoNettoIva.value;
      veicolo.dataAggiornamento = this.veicoloForm.controls.dataAggiornamento.value;
      veicolo.dataAttivazioneavm = this.veicoloForm.controls.dataAttivazioneavm.value;
      veicolo.dataConsegnaAdAziendaTpl = this.veicoloForm.controls.dataConsegnaAdAziendaTpl.value;
      veicolo.dataContrattoAziendaTpl = this.veicoloForm.controls.dataContrattoAziendaTpl.value;
      veicolo.dataInserimento = this.veicoloForm.controls.dataInserimento.value;
      veicolo.dataPrimaImm = this.veicoloForm.controls.dataPrimaImm.value;
      veicolo.dataScadGaranziaBase = this.veicoloForm.controls.dataScadGaranziaBase.value;
      veicolo.dataScadGaranziaEstesa = this.veicoloForm.controls.dataScadGaranziaEstesa.value;
      veicolo.dataScadUsufrutto = this.veicoloForm.controls.dataScadUsufrutto.value;
      veicolo.dataScadVincolo = this.veicoloForm.controls.dataScadVincolo.value;
      veicolo.dataUltimaRevisione = this.veicoloForm.controls.dataUltimaRevisione.value;
      veicolo.depositoRicoveroProtComunicazione = this.veicoloForm.controls.depositoRicoveroProtComunicazione.value;
      veicolo.idUtente = this.veicoloForm.controls.idUtente.value;
      veicolo.indirizzoDepositoRicovero = this.veicoloForm.controls.indirizzoDepositoRicovero.value;
      veicolo.kmDataRevisione = this.veicoloForm.controls.kmDataRevisione.value;
      veicolo.lunghezza = this.veicoloForm.controls.lunghezza.value;
      veicolo.note = this.veicoloForm.controls.note.value;
      veicolo.numPorte = this.veicoloForm.controls.numPorte.value;
      veicolo.targa1imm = this.veicoloForm.controls.targa1imm.value;
      veicolo.utimaVerIspettiva = this.veicoloForm.controls.utimaVerIspettiva.value;
      veicolo.assegnatario = this.veicoloForm.controls.assegnatario.value;
      veicolo.categoria = this.veicoloForm.controls.categoria.value;
      veicolo.classe = this.veicoloForm.controls.classe.value;
      veicolo.dispCopiaCartaCirc = this.veicoloForm.controls.dispCopiaCartaCirc.value;
      veicolo.fornitore = this.veicoloForm.controls.fornitore.value;
      veicolo.modello = this.veicoloForm.controls.modello.value;
      veicolo.regimeProprieta = this.veicoloForm.controls.regimeProprieta.value;
      veicolo.tipoAlimentazione = this.veicoloForm.controls.tipoAlimentazione.value;
      veicolo.tipoAllestimento = this.veicoloForm.controls.tipoAllestimento.value;
      
  




      if (this.veicoloForm.invalid) {
        return;
      }
      console.log(veicolo);
      this.loading2=true;
      this.http.post<GenerateResponse>(`${environment.apiUrl}generateVeicolo`, veicolo).subscribe(res => {
        if(res){
            //this.garaGenerata = res.id;
            this.loading2=false;
            this.getListaVeicolo();
            this.toastr.success('Veicolo generato con successo!','Info',{progressBar: false});          
          } else {
            this.loading2=false;
            this.getListaVeicolo();
            this.toastr.error('Errore nella generazione del Veicolo!','Errore',{progressBar: false});
          }
      }, err => {
        console.log(err);
        this.toastr.error('Errore nella generazione del Veicolo!','Errore',{progressBar: false});
      })
       this.veicoloForm.reset();
       this.modalService.dismissAll();
  }

  


  deleteVeicolo(idVeicolo){
    this.loading=true;
    this.http.get<Veicolo[]>(`${environment.apiUrl}deleteVeicolo/${idVeicolo}`)
    .subscribe(
      res =>{
        console.log(res);
        if (res.length!==0) {
          this.listVeicolo= res;
          this.toastr.success('Veicolo eliminato con successo!','Lista Veicoli aggiornata',{progressBar: false});
        } else {
          this.toastr.error('Nessun Veicolo trovato!','Veicolo',{progressBar: false});
        }
        this.loading=false;
      },
      err =>{
        console.log(err);        
        this.loading=false;
      }
    )
    
  }

  compareFn(a: Dizionario, b: Dizionario) {
    return a && b && a.id === b.id;
  }

  openLg(content:any, veicolo:Veicolo) {
    this.getListaFinAcq('FIN_ACQ');
    //
    this.veicoloForm.controls['id'].setValue('');
    this.veicoloForm.controls['codGara'].setValue('');
    this.veicoloForm.controls['cup'].setValue('');
    this.veicoloForm.controls['cig'].setValue('');
    this.veicoloForm.controls['rup'].setValue('');
    this.veicoloForm.controls['dec'].setValue('');
    this.veicoloForm.controls['finAcq'].setValue(null);
    if (veicolo != null) {
      this.veicoloForm.controls['id'].setValue(veicolo.id);
      this.veicoloForm.controls['codGara'].setValue(veicolo.codGara);
      this.veicoloForm.controls['cup'].setValue(veicolo.cup);
      this.veicoloForm.controls['cig'].setValue(veicolo.cig);
      this.veicoloForm.controls['rup'].setValue(veicolo.rup);
      this.veicoloForm.controls['dec'].setValue(veicolo.drec);
      this.veicoloForm.controls['finAcq'].setValue(veicolo.finAcq);
     
    }
   
    this.modalService.open(content, { ariaLabelledBy: 'modalsos', size: 'lg' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

 

}




