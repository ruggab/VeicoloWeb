import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDatepicker, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { GenerateResponse } from 'src/app/model/GenerateResponse';
import { Dizionario } from 'src/app/model/Dizionario';
import { Veicolo } from 'src/app/model/Veicolo';
import { Azienda } from 'src/app/model/Azienda';

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
  listAzienda : Azienda[] = [];
  listCategoria : Dizionario[] = [];
  listClasse : Dizionario[] = [];
  listFornitore : Dizionario[] = [];
  listRegimeProprieta : Dizionario[] = [];
  listModello : Dizionario[] = [];
  listAlimentazione : Dizionario[] = [];
  listAllestimento : Dizionario[] = [];
  listDispCopiaCC : Dizionario[] = [];
  listVeicolo : Veicolo[] =[];
  submitted = false;
  
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr : ToastrService,
  ) {

    
    this.cercaVeicoloForm = this.fb.group({
      matricola : [''],
      telaio : [''],
      assegnatario:new FormControl(null)

    });


    

    this.veicoloForm = this.fb.group({
      id : [''],
      matricola : ['',Validators.required],
      telaio : [''],
      numSimSerialNumber : [''],
      numSimTelefonico : [''],
      costoAcquistoNettoIva : [''],
      dataAttivazioneavm : new Date(null),
      dataConsegnaAdAziendaTpl : new Date(null),
      dataContrattoAziendaTpl : new Date(null),
      dataPrimaImm : new Date(null),
      dataScadGaranziaBase : new Date(null),
      dataScadGaranziaEstesa :new Date(null),
      dataScadUsufrutto : new Date(null),
      dataScadVincolo : new Date(null),
      dataUltimaRevisione : new Date(null),
      depositoRicoveroProtComunicazione : [''],
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
    this.getListaAziende();
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

  getListaDiz(contesto: string){
    this.http.get<Dizionario[]>(`${environment.apiUrl}getListDizionario/${contesto}`)
    .subscribe(
      res =>{
        if (contesto=='CATEGORIA') {
          this.listCategoria= res;
        } 
        if (contesto=='CLASSE') {
          this.listClasse= res;
        } 
        if (contesto=='SN') {
          this.listDispCopiaCC= res;
        } 
        if (contesto=='FORNITORE') {
          this.listFornitore= res;
        } 
        if (contesto=='REGIME_PROPRIETA') {
          this.listRegimeProprieta= res;
        } 
        if (contesto=='MODELLO') {
          this.listModello= res;
        } 
        if (contesto=='TIPO_ALIMENT') {
          this.listAlimentazione= res;
        } 
        if (contesto=='TIPO_ALLESTIMENTO') {
          this.listAllestimento= res;
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
    veicolo.assegnatario = this.cercaVeicoloForm.controls.assegnatario.value;
    // veicolo.tipoAlimentazione = this.cercaVeicoloForm.controls.tipoAlimentazione.value;
    // veicolo.classe = this.cercaVeicoloForm.controls.classe.value;
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
            this.listVeicolo= res;
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
      var utente = JSON.parse(localStorage.getItem('currentUser'));
      this.submitted = true;
      let veicolo : Veicolo = new Veicolo();

      veicolo.id = this.veicoloForm.controls.id.value;
      veicolo.matricola = this.veicoloForm.controls.matricola.value;
      veicolo.telaio = this.veicoloForm.controls.telaio.value;
      veicolo.assegnatario = this.veicoloForm.controls.assegnatario.value;

      veicolo.fornitore = this.veicoloForm.controls.fornitore.value;
      veicolo.categoria = this.veicoloForm.controls.categoria.value;
      veicolo.classe = this.veicoloForm.controls.classe.value;

      veicolo.dispCopiaCartaCirc = this.veicoloForm.controls.dispCopiaCartaCirc.value;
      veicolo.modello = this.veicoloForm.controls.modello.value;
      veicolo.regimeProprieta = this.veicoloForm.controls.regimeProprieta.value;

      veicolo.tipoAlimentazione = this.veicoloForm.controls.tipoAlimentazione.value;
      veicolo.tipoAllestimento = this.veicoloForm.controls.tipoAllestimento.value;
      veicolo.lunghezza = this.veicoloForm.controls.lunghezza.value;

      veicolo.numPorte = this.veicoloForm.controls.numPorte.value;
      veicolo.targa1Imm = this.veicoloForm.controls.targa1imm.value;
      veicolo.dataPrimaImm = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataPrimaImm.value);

      veicolo.kmDataRevisione = this.veicoloForm.controls.kmDataRevisione.value;
      veicolo.dataUltimaRevisione = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataUltimaRevisione.value);
      veicolo.dataScadUsufrutto = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataScadUsufrutto.value);

      veicolo.dataAttivazioneavm = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataAttivazioneavm.value);
      veicolo.dataContrattoAziendaTpl = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataContrattoAziendaTpl.value);
      veicolo.dataConsegnaAdAziendaTpl = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataConsegnaAdAziendaTpl.value);
     

      veicolo.numSimSerialNumber = this.veicoloForm.controls.numSimSerialNumber.value;
      veicolo.numSimTelefonico = this.veicoloForm.controls.numSimTelefonico.value;
      veicolo.costoAcquistoNettoIva = this.veicoloForm.controls.costoAcquistoNettoIva.value;
     
     
      
      // veicolo.dataScadGaranziaBase = this.veicoloForm.controls.dataScadGaranziaBase.value;
      // veicolo.dataScadGaranziaEstesa = this.veicoloForm.controls.dataScadGaranziaEstesa.value;
      // veicolo.dataScadVincolo = this.veicoloForm.controls.dataScadVincolo.value;
      
      veicolo.depositoRicoveroProtComunicazione = this.veicoloForm.controls.depositoRicoveroProtComunicazione.value;
      veicolo.indirizzoDepositoRicovero = this.veicoloForm.controls.indirizzoDepositoRicovero.value;
     
      veicolo.utimaVerIspettiva = this.veicoloForm.controls.utimaVerIspettiva.value;
      veicolo.note = this.veicoloForm.controls.note.value;
     
      veicolo.username = utente.username;
  
     
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
        this.loading2=false;
        console.log(err);
        this.toastr.error('Errore nella generazione del Veicolo!','Errore',{progressBar: false});
      })
      this.loading2=false;
       //this.veicoloForm.reset();
       //this.modalService.dismissAll();
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

  compareAzienda(a: Azienda, b: Azienda) {
    return a && b && a.id === b.id;
  }
  

   fromStringToDate(dateString: any){
      if (dateString != null){
        let parts=dateString.split('-');
        let initialStartDate = {
          year: parseInt(parts[0]), 
          month: parseInt(parts[1]), 
          day: parseInt(parts[2])
        };
        return initialStartDate;
      } else {
        return new Date (null);
      }
  }

  fromNgbDatePickerToDate(date: NgbDatepicker){
    if (date != null){
      return new Date(date['year'],date['month'],date['day']);
    } else {
      return new Date (null);
    }
}
  
  openLg(content:any, veicolo:Veicolo) {
    this.getListaDiz('CATEGORIA');
    this.getListaDiz('CLASSE');
    this.getListaDiz('SN');
    this.getListaDiz('FORNITORE');
    this.getListaDiz('MODELLO');
    this.getListaDiz('REGIME_PROPRIETA');
    this.getListaDiz('TIPO_ALIMENT');
    this.getListaDiz('TIPO_ALLESTIMENTO');
    this.getListaAziende();
    //
    if (veicolo == null) { 
        this.veicoloForm.controls['id'].setValue('');
        this.veicoloForm.controls['matricola'].setValue('');
        this.veicoloForm.controls['telaio'].setValue('');
        this.veicoloForm.controls['assegnatario'].setValue(null);
        this.veicoloForm.controls['fornitore'].setValue(null);

        this.veicoloForm.controls['categoria'].setValue(null);
        this.veicoloForm.controls['classe'].setValue(null);
        this.veicoloForm.controls['dispCopiaCartaCirc'].setValue(null);
        this.veicoloForm.controls['modello'].setValue(null);

        this.veicoloForm.controls['regimeProprieta'].setValue(null);
        this.veicoloForm.controls['tipoAlimentazione'].setValue(null);
        this.veicoloForm.controls['tipoAllestimento'].setValue(null);

        this.veicoloForm.controls['targa1imm'].setValue('');
        this.veicoloForm.controls['numPorte'].setValue('');
        this.veicoloForm.controls['lunghezza'].setValue('');
        this.veicoloForm.controls['kmDataRevisione'].setValue('');
        this.veicoloForm.controls['numSimSerialNumber'].setValue('');
        this.veicoloForm.controls['numSimTelefonico'].setValue('');
        this.veicoloForm.controls['costoAcquistoNettoIva'].setValue('');

        this.veicoloForm.controls['dataPrimaImm'].setValue('');
        this.veicoloForm.controls['dataAttivazioneavm'].setValue('');
        this.veicoloForm.controls['dataConsegnaAdAziendaTpl'].setValue('');
        this.veicoloForm.controls['dataContrattoAziendaTpl'].setValue('');
        this.veicoloForm.controls['dataScadUsufrutto'].setValue('');
        this.veicoloForm.controls['dataUltimaRevisione'].setValue('');

        this.veicoloForm.controls['depositoRicoveroProtComunicazione'].setValue('');
        this.veicoloForm.controls['note'].setValue('');
        this.veicoloForm.controls['indirizzoDepositoRicovero'].setValue('');
       
       
      
        // this.veicoloForm.controls['dataScadGaranziaBase'].setValue('');
        // this.veicoloForm.controls['dataScadGaranziaEstesa'].setValue('');
        // this.veicoloForm.controls['dataScadVincolo'].setValue('');
       
    }

    if (veicolo != null) { 

      

      this.veicoloForm.controls['id'].setValue(veicolo.id);

      this.veicoloForm.controls['matricola'].setValue(veicolo.matricola);
      this.veicoloForm.controls['telaio'].setValue(veicolo.telaio);
      this.veicoloForm.controls['assegnatario'].setValue(veicolo.assegnatario);
      this.veicoloForm.controls['fornitore'].setValue(veicolo.fornitore);

      this.veicoloForm.controls['categoria'].setValue(veicolo.categoria);
      this.veicoloForm.controls['classe'].setValue(veicolo.classe);
      this.veicoloForm.controls['dispCopiaCartaCirc'].setValue(veicolo.dispCopiaCartaCirc);
      this.veicoloForm.controls['modello'].setValue(veicolo.modello);

      this.veicoloForm.controls['regimeProprieta'].setValue(veicolo.regimeProprieta);
      this.veicoloForm.controls['tipoAlimentazione'].setValue(veicolo.tipoAlimentazione);
      this.veicoloForm.controls['tipoAllestimento'].setValue(veicolo.tipoAllestimento);
      this.veicoloForm.controls['targa1imm'].setValue(veicolo.targa1Imm);

      this.veicoloForm.controls['dataPrimaImm'].setValue(this.fromStringToDate(veicolo.dataPrimaImm));
      this.veicoloForm.controls['dataScadUsufrutto'].setValue(this.fromStringToDate(veicolo.dataScadUsufrutto));
      this.veicoloForm.controls['dataAttivazioneavm'].setValue(this.fromStringToDate(veicolo.dataAttivazioneavm));
      this.veicoloForm.controls['dataConsegnaAdAziendaTpl'].setValue(this.fromStringToDate(veicolo.dataConsegnaAdAziendaTpl));
      this.veicoloForm.controls['dataContrattoAziendaTpl'].setValue(this.fromStringToDate(veicolo.dataContrattoAziendaTpl));
      this.veicoloForm.controls['dataUltimaRevisione'].setValue(this.fromStringToDate(veicolo.dataUltimaRevisione));
      
      this.veicoloForm.controls['numSimSerialNumber'].setValue(veicolo.numSimSerialNumber);
      this.veicoloForm.controls['numSimTelefonico'].setValue(veicolo.numSimTelefonico);
      this.veicoloForm.controls['costoAcquistoNettoIva'].setValue(veicolo.costoAcquistoNettoIva);
      // this.veicoloForm.controls['dataScadGaranziaBase'].setValue(veicolo.dataScadGaranziaBase);
      // this.veicoloForm.controls['dataScadGaranziaEstesa'].setValue(veicolo.dataScadGaranziaEstesa);
      // this.veicoloForm.controls['dataScadVincolo'].setValue(veicolo.dataScadVincolo);



      this.veicoloForm.controls['depositoRicoveroProtComunicazione'].setValue(veicolo.depositoRicoveroProtComunicazione);
      this.veicoloForm.controls['indirizzoDepositoRicovero'].setValue(veicolo.indirizzoDepositoRicovero);
       
      this.veicoloForm.controls['kmDataRevisione'].setValue(veicolo.kmDataRevisione);
      this.veicoloForm.controls['lunghezza'].setValue(veicolo.lunghezza);
      this.veicoloForm.controls['note'].setValue(veicolo.note);
      this.veicoloForm.controls['numPorte'].setValue(veicolo.numPorte);
      
      this.veicoloForm.controls['utimaVerIspettiva'].setValue(veicolo.utimaVerIspettiva);
      
    }
    this.modalService.open(content, { ariaLabelledBy: 'modalsos', size: 'lg' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }


 



}




