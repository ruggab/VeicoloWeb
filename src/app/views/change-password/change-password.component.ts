import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormBuilder, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

// import custom validator to validate that password and confirm password fields match
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { environment } from 'src/environments/environment';
import { GenerateResponse } from 'src/app/model/GenerateResponse';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  animations: [SharedAnimations]
})
export class ChangePasswordComponent implements OnInit {

  loading: boolean;
  loadingText: string = "Registrati";
  changePswForm: FormGroup;
  submitted = false;
  headerDict = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
 

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

    this.changePswForm = this.fb.group({      
      oldPassword: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.changePswForm.controls; }

  onSubmit() {
    
    this.submitted = true;

    // stop here if form is invalid
    if (this.changePswForm.invalid) {
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
   
    console.log(this.changePswForm.value);
    this.http.post<GenerateResponse>(`${environment.apiUrl}auth/changePassword`, JSON.stringify(this.changePswForm.value), this.requestOptions).subscribe(
 // this.http.post<GenerateResponse>(`${environment.apiUrl}generateAzienda`, azienda).subscribe(res => {
      res => {
        console.log(res);
        this.toastr.success('Cambio Password.', 'Cambio Password avvenuto con successo', { progressBar: false });
        // this.router.navigateByUrl('/sessions/signin');
        this.loading = false;
      }, err => {
        this.toastr.error('Cambio Password.', "Si è verificato un errore");
        this.loading = false;
        this.loadingText = 'Cambio Password';
        console.log(err);
      })
  }

}
