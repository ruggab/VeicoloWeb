import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormBuilder, FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

// import custom validator to validate that password and confirm password fields match
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { environment } from 'src/environments/environment';
import { Azienda } from 'src/app/model/Azienda';
import { GenerateResponse } from 'src/app/model/GenerateResponse';

@Component({
  selector: 'app-add.user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  animations: [SharedAnimations]
})
export class AddUserComponent implements OnInit {

  loading: boolean;
  loadingText: string = "Registrazione";
  addUserForm: FormGroup;
  submitted = false;
  listAzienda : Azienda[] = [];


  headerDict = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  roles: string[] = [];

  requestOptions = {
    headers: new HttpHeaders(this.headerDict)
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.loading = false;

    this.addUserForm = this.fb.group({      
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      username: ['', Validators.required],
      azienda: [null, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.getListaAziende();


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
      this.http.post<GenerateResponse>(`${environment.apiUrl}auth/addUser`, JSON.stringify(this.addUserForm.value), this.requestOptions).subscribe(
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

}
