import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormBuilder, FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

// import custom validator to validate that password and confirm password fields match
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { environment } from 'src/environments/environment';
import { Azienda } from 'src/app/model/Azienda';
import { GenerateResponse } from 'src/app/model/GenerateResponse';
import { Utente } from 'src/app/model/Utente';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-add.user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  animations: [SharedAnimations]
})
export class AddUserComponent implements OnInit {

  loading: boolean;
  moduleLoading;
  loadingcsv;
  loadingText: string = "Registrazione";
  addUserForm: FormGroup;
  cercaUtenteForm : FormGroup;
  
  listAzienda : Azienda[] = [];

  listUtente : Utente[] =[];
  submitted = false;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) { 

    this.cercaUtenteForm = this.fb.group({
      username : [''],
      azienda:new FormControl(null)
    });

    this.addUserForm = this.fb.group({     
      id : [''], 
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      username: ['', Validators.required],
      azienda: [null, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

}

  ngOnInit() {
    
    this.getListaAziende();
    this.cercaUtente();
  }

  cercaUtente(){
    this.submitted = true;
    let  utente: Utente = new Utente();
    utente.username = this.cercaUtenteForm.controls.username.value;
    utente.azienda = this.cercaUtenteForm.controls.azienda.value;
    // veicolo.tipoAlimentazione = this.cercaVeicoloForm.controls.tipoAlimentazione.value;
    // veicolo.classe = this.cercaVeicoloForm.controls.classe.value;
    if (this.cercaUtenteForm.invalid) {
      return;
    }
    console.log(utente);
    this.loading=true;
    
    this.http.post<Utente[]>(`${environment.apiUrl}auth/getListUtenteByFilter`, utente).subscribe(
        res =>{
          console.log(res);
          if (res.length!==0) {
            this.listUtente= res;
          } else {
            this.listUtente= res;
            this.toastr.error('Nessun Utente trovato!','Utente',{progressBar: false});
          }
          this.loading=false;
        },
        err =>{
          console.log(err);        
          this.loading=false;
        }
      )
  }

  getListaAziende(){
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

  exportCSV(){
    this.loadingcsv = true;
    this.http.get<Utente[]>(`${environment.apiUrl}auth/getListUtenteByFilter`)
    .subscribe(
      res =>{
        console.log(res);
        if(res.length!==0) {
          this.listUtente = res;
          this.downloadCSV(this.listUtente);
          this.loadingcsv = false;
        } else{
          this.toastr.error('Nessun Utente trovato!','Utente',{progressBar: false});
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
    saveAs(blob, "lista-utenti.csv");
  
}

  compareAzienda(a: Azienda, b: Azienda) {
    return a && b && a.id === b.id;
  }

  // convenience getter for easy access to form fields
  get f() { return this.addUserForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addUserForm.invalid) {
      return;
    }
    this.loading = true;
    this.loadingText = 'Registrazione in corso...';
    this.conferma();   

  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmpassword').value;
    return password === confirmPassword ? null : { notSame: true }
  }

  
  // signup() {
  //   this.loading = true;
  //   this.loadingText = 'Registrazione in corso...';
  //   this.registMovarish();
  // }



  conferma() {
      console.log(this.addUserForm.value);
      this.http.post<GenerateResponse>(`${environment.apiUrl}auth/addUser`,this.addUserForm.value).subscribe(
   // this.http.post<GenerateResponse>(`${environment.apiUrl}generateAzienda`, azienda).subscribe(res => {
        res => {
          console.log(res);
          this.toastr.success('Aggiungi Utente.', 'Utente inserito con successo', { progressBar: false });
          // this.router.navigateByUrl('/sessions/signin');
          this.loading = false;
        }, err => {
          this.toastr.error('Aggiungi Utente.', err.error.message);
          this.loading = false;
          this.loadingText = 'Aggiungi Utente';
          console.log(err);
        })
  }

  
  deleteUtente(idUtente){
    this.loading=true;
    this.http.get<Utente[]>(`${environment.apiUrl}auth/deleteUtente/${idUtente}`)
    .subscribe(
      res =>{
        console.log(res);
        if (res.length!==0) {
          this.listUtente= res;
          this.toastr.success('Utente eliminato con successo!','Lista Utente aggiornata',{progressBar: false});
        } else {
          this.toastr.error('Nessun Utente trovato!','Utente',{progressBar: false});
        }
        this.loading=false;
      },
      err =>{
        console.log(err);        
        this.loading=false;
      }
    )
  }

  openLg(content:any, utente:Utente) {
    this.getListaAziende();
    //
    if (utente == null) {
     
      this.addUserForm.controls['id'].setValue('');
      this.addUserForm.controls['username'].setValue('');
      this.addUserForm.controls['email'].setValue('');
      this.addUserForm.controls['password'].setValue('');
      this.addUserForm.controls['confirmPassword'].setValue('');
      this.addUserForm.controls['azienda'].setValue(null);
    }
    if (utente != null) {
      this.addUserForm.controls['id'].setValue(utente.id);
      this.addUserForm.controls['username'].setValue(utente.username);
      this.addUserForm.controls['email'].setValue(utente.email);
      this.addUserForm.controls['password'].setValue(utente.password);
      this.addUserForm.controls['confirmPassword'].setValue(utente.confirmPassword);
      this.addUserForm.controls['azienda'].setValue(utente.azienda);
     
    }
   
    this.modalService.open(content, { ariaLabelledBy: 'modalsos', size: 'lg' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

}
