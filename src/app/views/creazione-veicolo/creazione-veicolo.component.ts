import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { Gara } from 'src/app/model/Gara';

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
  listGara : Gara[] = [];
  listCategoria : Dizionario[] = [];
  listClasse : Dizionario[] = [];
  listClasseAmb : Dizionario[] = [];
  listFornitore : Dizionario[] = [];
  listRegimeProprieta : Dizionario[] = [];
  listModello : Dizionario[] = [];
  listAlimentazione : Dizionario[] = [];
  listAllestimento : Dizionario[] = [];
  listDispCopiaCC : Dizionario[] = [];
  listVeicolo : Veicolo[] =[];
  submitted = false;
  utente: any;
  isAdmin = false;

  fileCC?: File;
  fileELA?: File;

  
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr : ToastrService,
  ) {

    this.utente = JSON.parse(localStorage.getItem('currentUser'));
    this.isAdmin = this.utente.roles.indexOf('ROLE_ADMIN') > -1;
    
    this.cercaVeicoloForm = this.fb.group({
      matricola : [''],
      telaio : [''],
      assegnatario:new FormControl(null),
      gara:new FormControl(null)
    });


    

    this.veicoloForm = this.fb.group({
      id : [''],
      matricola : ['',Validators.required],
      telaio : [''],
      numSimSerialNumber : [''],
      numSimTelefonico : [''],
      dataPrimaImm : null,
     
      dataScadVincolo : new Date(null),
      lunghezza: [''],
      numPorte: [''],
      targa1imm: [''], 
      fornitore: new FormControl(null),
      modello: new FormControl(null),
      tipoAlimentazione: new FormControl(null),
      tipoAllestimento: new FormControl(null),
      categoria: new FormControl(null),
      classe :new FormControl(null),
      classeAmbientale :new FormControl(null),

     


      //Info
      gara:new FormControl(null),
      assegnatario:new FormControl(null), 
      determAssegnazione:[''],
      dataConsegnaAziendaTpl : new Date(null),
      dataContrattoAssegnAziendaTpl : new Date(null),
      dataContrattoApplAziendaTpl: new Date(null),
      dataAttivazioneAvm : new Date(null),
      regimeProprieta: new FormControl(null),
      costoAcquistoNettoIva : [''],
      numProtocolloRicovero : [''],
      protArrivoAcamMessADispCons: [''],
      protComSituazApparati: [''],
      dataScadTassaPossesso : new Date(null),
      dataScadRca : new Date(null),
      dataUltimaVerificaIsp: new Date(null),
      estremiProtRappVerIsp:[''],
      noteVerificaIsp: [''],
     
      //Polizze Garanzie
      protFidGaranziaBase: [''],
    	protFidGaranziaEstesa : [''],
	    numPolGaranziaBase : [''],
	    numPolGaranziaEstesa : [''],
      dataScadPolGaranziaBase  : new Date(null),
      dataScadPolGaranziaEstesa  : new Date(null),
      dataScadGaranziaBase : new Date(null),
      dataScadGaranziaEstesa : new Date(null),


      //Usufrutto
      dataScadUsufrutto : new Date(null),
      estremiContrUsufrutto : [''],  
      dataContrUsufrutto:new Date(null),
      valAnnuoCanone : [''],  
      valPrimoCanone : [''],  
      valDa2a8Canone : [''],  
      val9Canone : [''],  
      val10Canone : [''],  
      val11Canone : [''],  

      //Azienda
      dispCopiaCartaCirc : new FormControl(null),
      contrattoServizio: [''],
      dataCessMarcia: new Date(null),
      motivoFermo: [''],
      indirizzoDepositoRicovero: [''],
      kmDataRevisione: [''],
      dataUltimaRevisione : new Date(null),
      nomefileCC: [''],
      nomefileELA: ['']

    });
    

    
  }

  ngOnInit() {
    //this.getListaVeicolo();
    this.getListaAziende();
    this.getListaGare();

    //
    let utente = JSON.parse(localStorage.getItem('currentUser'));
   
    this.cercaVeicoloForm.controls['assegnatario'].setValue(utente.aziendas[0]);
    this.cercaVeicolo();

  }

  get f() { return this.veicoloForm.controls; }

 
  getListaVeicolo(){
    //
    let utente = JSON.parse(localStorage.getItem('currentUser'));
    this.listAzienda = utente.aziendas;
    //
    this.http.get<Veicolo[]>(`${environment.apiUrl}getListVeicolo`)
    .subscribe(
      res =>{
        console.log(res);
        if (res.length!==0) {
          this.listVeicolo= res;
        } else {
          this.toastr.error('Nessuna Veicolo trovato!','Veicolo',{progressBar: false});
        }
        
      },
      err =>{
        console.log(err); 
      }
    )
  }

  getListaAziende(){
    
    this.listAzienda = this.utente.aziendas;
    if (this.isAdmin) {
      
      this.http.get<Azienda[]>(`${environment.apiUrl}getListAzienda`)
      .subscribe(
        res =>{
          console.log(res);
          if (res.length!==0) {
            this.listAzienda= res;
          } else {
            this.toastr.error('Nessun Azienda trovata!','Azienda',{progressBar: false});
          }
        },
        err =>{
          console.log(err);        }
      )
    }
    
  }

  getListaGare(){
    this.http.get<Gara[]>(`${environment.apiUrl}getListGara`)
    .subscribe(
      res =>{
        console.log(res);
        if (res.length!==0) {
          this.listGara= res;
        } else {
          this.toastr.error('Nessuna Gara trovata!','Gara',{progressBar: false});
        }
      },
      err =>{
        console.log(err); 
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
        if (contesto=='CLASSE_AMB') {
          this.listClasseAmb= res;
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
    this.moduleLoading=true;
    
    this.http.post<Veicolo[]>(`${environment.apiUrl}getListVeicoloByFilter`, veicolo).subscribe(
        res =>{
          console.log(res);
          if (res.length!==0) {
            this.listVeicolo= res;
          } else {
            this.listVeicolo= res;
            this.toastr.error('Nessun Veicolo trovato!','Veicolo',{progressBar: false});
          }
          this.moduleLoading=false;
        },
        err =>{
          console.log(err);        
          this.moduleLoading=false;
        }
      )
  }

 

  salvaVeicolo(){
      var utente = JSON.parse(localStorage.getItem('currentUser'));
      this.submitted = true;
      let veicolo : Veicolo = new Veicolo();
      // Dati Veicolo
      veicolo.id = this.veicoloForm.controls.id.value;
      veicolo.matricola = this.veicoloForm.controls.matricola.value;
      veicolo.telaio = this.veicoloForm.controls.telaio.value;
      veicolo.fornitore = this.veicoloForm.controls.fornitore.value;
      veicolo.categoria = this.veicoloForm.controls.categoria.value;
      veicolo.classe = this.veicoloForm.controls.classe.value;
      veicolo.classeAmbientale = this.veicoloForm.controls.classeAmbientale.value;
      veicolo.dispCopiaCartaCirc = this.veicoloForm.controls.dispCopiaCartaCirc.value;
      veicolo.modello = this.veicoloForm.controls.modello.value;
      veicolo.tipoAlimentazione = this.veicoloForm.controls.tipoAlimentazione.value;
      veicolo.tipoAllestimento = this.veicoloForm.controls.tipoAllestimento.value;
      veicolo.lunghezza = this.veicoloForm.controls.lunghezza.value;
      veicolo.numPorte = this.veicoloForm.controls.numPorte.value;
      veicolo.targa1Imm = this.veicoloForm.controls.targa1imm.value;
      veicolo.dataPrimaImm = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataPrimaImm.value);
      veicolo.numSimSerialNumber = this.veicoloForm.controls.numSimSerialNumber.value;
      veicolo.numSimTelefonico = this.veicoloForm.controls.numSimTelefonico.value;
      
     
      //info Veicolo
      veicolo.gara = this.veicoloForm.controls.gara.value;
      veicolo.assegnatario = this.veicoloForm.controls.assegnatario.value;
      veicolo.determAssegnazione = this.veicoloForm.controls.determAssegnazione.value;
      veicolo.dataContrattoAssegnAziendaTpl = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataContrattoAssegnAziendaTpl.value);
      veicolo.dataConsegnaAziendaTpl = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataConsegnaAziendaTpl.value);
      veicolo.dataContrattoApplAziendaTpl = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataContrattoApplAziendaTpl.value);
      veicolo.dataAttivazioneAvm = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataAttivazioneAvm.value);
      veicolo.regimeProprieta = this.veicoloForm.controls.regimeProprieta.value;
      veicolo.costoAcquistoNettoIva = this.veicoloForm.controls.costoAcquistoNettoIva.value;
      veicolo.numProtocolloRicovero = this.veicoloForm.controls.numProtocolloRicovero.value;
      veicolo.protComSituazApparati = this.veicoloForm.controls.protComSituazApparati.value;
      veicolo.protArrivoAcamMessADispCons = this.veicoloForm.controls.protArrivoAcamMessADispCons.value;
      veicolo.dataScadTassaPossesso = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataScadTassaPossesso.value);
      veicolo.dataScadRca = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataScadRca.value);
      veicolo.dataUltimaVerificaIsp = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataUltimaVerificaIsp.value);
      veicolo.estremiProtRappVerIsp = this.veicoloForm.controls.estremiProtRappVerIsp.value;
      veicolo.noteVerificaIsp = this.veicoloForm.controls.noteVerificaIsp.value;
     
      //Pollize Garanzie
      veicolo.protFidGaranziaBase = this.veicoloForm.controls.protFidGaranziaBase.value;
      veicolo.protFidGaranziaEstesa = this.veicoloForm.controls.protFidGaranziaEstesa.value;
      veicolo.numPolGaranziaBase = this.veicoloForm.controls.numPolGaranziaBase.value;
      veicolo.numPolGaranziaEstesa = this.veicoloForm.controls.numPolGaranziaEstesa.value;
      veicolo.dataScadPolGaranziaBase = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataScadPolGaranziaBase.value);
      veicolo.dataScadPolGaranziaEstesa = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataScadPolGaranziaEstesa.value);
      veicolo.dataScadGaranziaBase = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataScadGaranziaBase.value);
      veicolo.dataScadGaranziaEstesa = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataScadGaranziaEstesa.value);

      //Usufrutto
      veicolo.estremiContrUsufrutto = this.veicoloForm.controls.estremiContrUsufrutto.value;
      veicolo.dataContrUsufrutto = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataContrUsufrutto.value);
      veicolo.dataScadUsufrutto = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataScadUsufrutto.value);
      veicolo.valAnnuoCanone = this.veicoloForm.controls.valAnnuoCanone.value;
      veicolo.valPrimoCanone = this.veicoloForm.controls.valPrimoCanone.value;
      veicolo.valDa2a8Canone = this.veicoloForm.controls.valDa2a8Canone.value;
      veicolo.val9Canone = this.veicoloForm.controls.val9Canone.value;
      veicolo.val10Canone = this.veicoloForm.controls.val10Canone.value;
      veicolo.val11Canone = this.veicoloForm.controls.val11Canone.value;

      //Azienda
      veicolo.contrattoServizio = this.veicoloForm.controls.contrattoServizio.value;
      veicolo.dataCessMarcia = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataCessMarcia.value);
      veicolo.motivoFermo = this.veicoloForm.controls.motivoFermo.value;
      veicolo.indirizzoDepositoRicovero = this.veicoloForm.controls.indirizzoDepositoRicovero.value;
      veicolo.dataUltimaRevisione = this.fromNgbDatePickerToDate(this.veicoloForm.controls.dataUltimaRevisione.value);
      veicolo.kmDataRevisione = this.veicoloForm.controls.kmDataRevisione.value;
      //veicolo.fileCC = this.fileCC;
      //veicolo.fileELA = this.fileELA;
      //
      veicolo.username = utente.username;
  
     
      if (this.veicoloForm.invalid) {
        const invalid = [];
          const controls = this.veicoloForm.controls;
          for (const name in controls) {
              if (name.indexOf("data") == -1 && controls[name].invalid) {
                  invalid.push(name);
              }
          }
          if (invalid.length > 0) {
            //this.openDialogMessage('Validate the fields: ' + invalid);
            console.log('Validate the fields: ' + invalid);
            this.toastr.error('Valida il campo: ' + invalid,'Errore',{progressBar: false});
            return;
          }
      }

       const formData = new FormData();
       formData.append("fileCC", this.fileCC);
       formData.append("fileELA", this.fileELA);
       formData.append("veicolo",  new Blob([JSON.stringify(veicolo)],
       {
           type: "application/json"
       }));
      

      
      console.log(veicolo);
      this.loading2=true;
      this.http.post<GenerateResponse>(`${environment.apiUrl}generateVeicolo`, formData ).subscribe(res => {
        
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

  compareGara(a: Gara, b: Gara) {
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
      return null;
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
    this.getListaDiz('CLASSE_AMB');
    this.getListaAziende();
    //
    if (veicolo == null) { 
        this.veicoloForm.controls['id'].setValue('');
        this.veicoloForm.controls['matricola'].setValue('');
        this.veicoloForm.controls['telaio'].setValue('');
        this.veicoloForm.controls['fornitore'].setValue(null);
        this.veicoloForm.controls['categoria'].setValue(null);
        this.veicoloForm.controls['classe'].setValue(null);
        this.veicoloForm.controls['classeAmbientale'].setValue(null);
        this.veicoloForm.controls['modello'].setValue(null);
        this.veicoloForm.controls['tipoAlimentazione'].setValue(null);
        this.veicoloForm.controls['tipoAllestimento'].setValue(null);
        this.veicoloForm.controls['targa1imm'].setValue('');
        this.veicoloForm.controls['numPorte'].setValue('');
        this.veicoloForm.controls['lunghezza'].setValue('');
        this.veicoloForm.controls['numSimSerialNumber'].setValue('');
        this.veicoloForm.controls['numSimTelefonico'].setValue('');
        this.veicoloForm.controls['dataPrimaImm'].setValue('');
      
        
       
        //Info veicolo
        this.veicoloForm.controls['gara'].setValue(null);
        this.veicoloForm.controls['assegnatario'].setValue(null);
        this.veicoloForm.controls['determAssegnazione'].setValue('');
        this.veicoloForm.controls['dataConsegnaAziendaTpl'].setValue('');
        this.veicoloForm.controls['dataContrattoAssegnAziendaTpl'].setValue('');
        this.veicoloForm.controls['dataContrattoApplAziendaTpl'].setValue('');
        this.veicoloForm.controls['dataAttivazioneAvm'].setValue('');
        this.veicoloForm.controls['regimeProprieta'].setValue(null);
        this.veicoloForm.controls['costoAcquistoNettoIva'].setValue('');
        this.veicoloForm.controls['numProtocolloRicovero'].setValue('');
        this.veicoloForm.controls['protArrivoAcamMessADispCons'].setValue('');
        this.veicoloForm.controls['protComSituazApparati'].setValue('');
        this.veicoloForm.controls['dataScadTassaPossesso'].setValue('');
        this.veicoloForm.controls['dataScadRca'].setValue('');
        this.veicoloForm.controls['dataUltimaVerificaIsp'].setValue('');
        this.veicoloForm.controls['estremiProtRappVerIsp'].setValue('');
        this.veicoloForm.controls['noteVerificaIsp'].setValue('');

        //Pollize Garanzie
        this.veicoloForm.controls['protFidGaranziaBase'].setValue('');
        this.veicoloForm.controls['protFidGaranziaEstesa'].setValue('');
        this.veicoloForm.controls['numPolGaranziaBase'].setValue('');
        this.veicoloForm.controls['numPolGaranziaEstesa'].setValue('');
        this.veicoloForm.controls['dataScadPolGaranziaBase'].setValue('');
        this.veicoloForm.controls['dataScadPolGaranziaEstesa'].setValue('');
        this.veicoloForm.controls['dataScadGaranziaBase'].setValue('');
        this.veicoloForm.controls['dataScadGaranziaEstesa'].setValue('');
     
     
        //usufrutto
        this.veicoloForm.controls['estremiContrUsufrutto'].setValue('');
        this.veicoloForm.controls['dataContrUsufrutto'].setValue('');
        this.veicoloForm.controls['dataScadUsufrutto'].setValue('');

        this.veicoloForm.controls['valAnnuoCanone'].setValue('');
        this.veicoloForm.controls['valPrimoCanone'].setValue('');
        this.veicoloForm.controls['valDa2a8Canone'].setValue('');

        this.veicoloForm.controls['val9Canone'].setValue('');
        this.veicoloForm.controls['val10Canone'].setValue('');
        this.veicoloForm.controls['val11Canone'].setValue('');

        //Azienda
        this.veicoloForm.controls['indirizzoDepositoRicovero'].setValue('');
        this.veicoloForm.controls['contrattoServizio'].setValue('');
        this.veicoloForm.controls['dataCessMarcia'].setValue('');
        this.veicoloForm.controls['motivoFermo'].setValue('');
        this.veicoloForm.controls['kmDataRevisione'].setValue('');
        this.veicoloForm.controls['dataUltimaRevisione'].setValue('');
        this.veicoloForm.controls['dispCopiaCartaCirc'].setValue(null);
       
    }

    if (veicolo != null) { 

      this.veicoloForm.controls['id'].setValue(veicolo.id);
      this.veicoloForm.controls['matricola'].setValue(veicolo.matricola);
      this.veicoloForm.controls['telaio'].setValue(veicolo.telaio);
      this.veicoloForm.controls['fornitore'].setValue(veicolo.fornitore);
      this.veicoloForm.controls['categoria'].setValue(veicolo.categoria);
      this.veicoloForm.controls['classe'].setValue(veicolo.classe);
      this.veicoloForm.controls['classeAmbientale'].setValue(veicolo.classeAmbientale);
      this.veicoloForm.controls['modello'].setValue(veicolo.modello);
      this.veicoloForm.controls['tipoAlimentazione'].setValue(veicolo.tipoAlimentazione);
      this.veicoloForm.controls['tipoAllestimento'].setValue(veicolo.tipoAllestimento);
      this.veicoloForm.controls['targa1imm'].setValue(veicolo.targa1Imm);
      this.veicoloForm.controls['dataPrimaImm'].setValue(this.fromStringToDate(veicolo.dataPrimaImm));
      this.veicoloForm.controls['dataUltimaRevisione'].setValue(this.fromStringToDate(veicolo.dataUltimaRevisione));
      this.veicoloForm.controls['numSimSerialNumber'].setValue(veicolo.numSimSerialNumber);
      this.veicoloForm.controls['numSimTelefonico'].setValue(veicolo.numSimTelefonico);
      
      //
      
      // this.veicoloForm.controls['dataScadGaranziaEstesa'].setValue(veicolo.dataScadGaranziaEstesa);
      // this.veicoloForm.controls['dataScadVincolo'].setValue(veicolo.dataScadVincolo);

     
      this.veicoloForm.controls['indirizzoDepositoRicovero'].setValue(veicolo.indirizzoDepositoRicovero);
       
      this.veicoloForm.controls['kmDataRevisione'].setValue(veicolo.kmDataRevisione);
      this.veicoloForm.controls['lunghezza'].setValue(veicolo.lunghezza);
    
      this.veicoloForm.controls['numPorte'].setValue(veicolo.numPorte);

      //Info Veicolo
      this.veicoloForm.controls['assegnatario'].setValue(veicolo.assegnatario);
      this.veicoloForm.controls['gara'].setValue(veicolo.gara);
      this.veicoloForm.controls['determAssegnazione'].setValue(veicolo.determAssegnazione);
     
      this.veicoloForm.controls['dataConsegnaAziendaTpl'].setValue(this.fromStringToDate(veicolo.dataConsegnaAziendaTpl));
      this.veicoloForm.controls['dataContrattoAssegnAziendaTpl'].setValue(this.fromStringToDate(veicolo.dataContrattoAssegnAziendaTpl));
      this.veicoloForm.controls['dataContrattoApplAziendaTpl'].setValue(this.fromStringToDate(veicolo.dataContrattoApplAziendaTpl));
      this.veicoloForm.controls['dataAttivazioneAvm'].setValue(this.fromStringToDate(veicolo.dataAttivazioneAvm));
      this.veicoloForm.controls['regimeProprieta'].setValue(veicolo.regimeProprieta);
      this.veicoloForm.controls['costoAcquistoNettoIva'].setValue(veicolo.costoAcquistoNettoIva);
      this.veicoloForm.controls['numProtocolloRicovero'].setValue(veicolo.numProtocolloRicovero);
      this.veicoloForm.controls['protArrivoAcamMessADispCons'].setValue(veicolo.protArrivoAcamMessADispCons);
      this.veicoloForm.controls['protComSituazApparati'].setValue(veicolo.protComSituazApparati);
      this.veicoloForm.controls['dataScadTassaPossesso'].setValue(this.fromStringToDate(veicolo.dataScadTassaPossesso));
      this.veicoloForm.controls['dataScadRca'].setValue(this.fromStringToDate(veicolo.dataScadRca));
      this.veicoloForm.controls['dataUltimaVerificaIsp'].setValue(this.fromStringToDate(veicolo.dataUltimaVerificaIsp));
      this.veicoloForm.controls['estremiProtRappVerIsp'].setValue(veicolo.estremiProtRappVerIsp);
      this.veicoloForm.controls['noteVerificaIsp'].setValue(veicolo.noteVerificaIsp);

      //Polizze Garanzie
      this.veicoloForm.controls['protFidGaranziaBase'].setValue(veicolo.protFidGaranziaBase);
      this.veicoloForm.controls['protFidGaranziaEstesa'].setValue(veicolo.protFidGaranziaEstesa);
      this.veicoloForm.controls['numPolGaranziaBase'].setValue(veicolo.numPolGaranziaBase);
      this.veicoloForm.controls['numPolGaranziaEstesa'].setValue(veicolo.numPolGaranziaEstesa);
      this.veicoloForm.controls['dataScadPolGaranziaBase'].setValue(this.fromStringToDate(veicolo.dataScadPolGaranziaBase));
      this.veicoloForm.controls['dataScadPolGaranziaEstesa'].setValue(this.fromStringToDate(veicolo.dataScadPolGaranziaEstesa));
      this.veicoloForm.controls['dataScadGaranziaBase'].setValue(this.fromStringToDate(veicolo.dataScadGaranziaBase));
      this.veicoloForm.controls['dataScadGaranziaEstesa'].setValue(this.fromStringToDate(veicolo.dataScadGaranziaEstesa));
     
     
      //Usufrutto
      this.veicoloForm.controls['estremiContrUsufrutto'].setValue(veicolo.estremiContrUsufrutto);
      this.veicoloForm.controls['dataContrUsufrutto'].setValue(this.fromStringToDate(veicolo.dataContrUsufrutto));
      this.veicoloForm.controls['dataScadUsufrutto'].setValue(this.fromStringToDate(veicolo.dataScadUsufrutto));

      this.veicoloForm.controls['valAnnuoCanone'].setValue(veicolo.valAnnuoCanone);
      this.veicoloForm.controls['valPrimoCanone'].setValue(veicolo.valPrimoCanone);
      this.veicoloForm.controls['valDa2a8Canone'].setValue(veicolo.valDa2a8Canone);

      this.veicoloForm.controls['val9Canone'].setValue(veicolo.val9Canone);
      this.veicoloForm.controls['val10Canone'].setValue(veicolo.val10Canone);
      this.veicoloForm.controls['val11Canone'].setValue(veicolo.val11Canone);

      
      //Azienda
      this.veicoloForm.controls['dispCopiaCartaCirc'].setValue(veicolo.dispCopiaCartaCirc);
      this.veicoloForm.controls['dataCessMarcia'].setValue(this.fromStringToDate(veicolo.dataCessMarcia));
      this.veicoloForm.controls['indirizzoDepositoRicovero'].setValue(veicolo.indirizzoDepositoRicovero);
      this.veicoloForm.controls['contrattoServizio'].setValue(veicolo.contrattoServizio);
      this.veicoloForm.controls['motivoFermo'].setValue(veicolo.motivoFermo);
      this.veicoloForm.controls['kmDataRevisione'].setValue('');
      this.veicoloForm.controls['dataUltimaRevisione'].setValue('');
      
      
    }
    this.modalService.open(content, { ariaLabelledBy: 'modalsos', size: 'lg' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }


  selectFileCC(event) {
    this.fileCC = event.target.files[0];
    this.veicoloForm.controls['nomefileCC'].setValue(this.fileCC.name);
  }

  selectFileELA(event) {
    this.fileELA = event.target.files[0];
    this.veicoloForm.controls['nomefileELA'].setValue(this.fileELA.name);
  }



}




