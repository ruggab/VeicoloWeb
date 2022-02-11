import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
  animations: [SharedAnimations]
})
export class ForgotComponent implements OnInit {

  loading: boolean = false;
  loadingText: string = "Invia";
  forgotForm: FormGroup;
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

    this.loading=false;
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      role: this.roles
    });
  }

  get f() { return this.forgotForm.controls; }

  onSubmit() {
    this.submitted = true;
    

    // stop here if form is invalid
    if (this.forgotForm.invalid) {
      return;
    }
    this.loading = true;
    this.loadingText = 'Registrazione in corso...';

    this.roles.push("user");
    console.log(this.forgotForm.value);
    this.http.post<any>(`${environment.apiUrl}auth/signup`, JSON.stringify(this.forgotForm.value), this.requestOptions).subscribe(
      res => {
        console.log(res);
        this.toastr.success('Recupera password.','Le sarà inviata una email con password provvisorio', { progressBar: false });
        this.router.navigateByUrl('/sessions/signin');
      }, err => {
        this.toastr.error('Recupera password.', "Si è verificato un errore o l'utente non è già registrato");
        this.loading = false;
        this.loadingText = 'Registrati';
        console.log(err);
      })
  }
  

}
