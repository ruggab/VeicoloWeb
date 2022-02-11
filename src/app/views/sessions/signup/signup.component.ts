import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormBuilder, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

// import custom validator to validate that password and confirm password fields match
import { MustMatch } from 'src/app/_helpers/must-match.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [SharedAnimations]
})
export class SignupComponent implements OnInit {

  loading: boolean;
  loadingText: string = "Registrati";
  signupForm: FormGroup;
  submitted = false;
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

    this.signupForm = this.fb.group({      
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      username: ['', Validators.required],
      role: this.roles,
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit() {
    
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }
    this.loading = true;
    this.loadingText = 'Registrazione in corso...';
    this.registMovarish();   
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmpassword').value;

    return password === confirmPassword ? null : { notSame: true }
  }
  signup() {
    this.loading = true;
    this.loadingText = 'Registrazione in corso...';
    this.registMovarish();
  }



  registMovarish() {
    this.roles.push("user");
    console.log(this.signupForm.value);
    this.http.post<any>(`${environment.apiUrl}auth/signup`, JSON.stringify(this.signupForm.value), this.requestOptions).subscribe(
      res => {
        console.log(res);
        this.toastr.success('Registrazione.', 'Registrazione avvenuta con successo', { progressBar: false });
        this.router.navigateByUrl('/sessions/signin');
      }, err => {
        this.toastr.error('Registrazione.', "Si è verificato un errore o l'utente è già registrato");
        this.loading = false;
        this.loadingText = 'Registrati';
        console.log(err);
      })
  }

}
