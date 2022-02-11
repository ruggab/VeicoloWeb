import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [SharedAnimations]
})
export class SigninComponent implements OnInit {
   
    loading: boolean;
    loadingText: string;
    signinForm: FormGroup;
    submitted = false;

    roles: string[] = [];

    constructor(
        private authentication: AuthenticationService,
        private authService: AuthService,
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.loading = false;
        this.signinForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role:this.roles
        });

        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
                this.loadingText = 'Caricamento...';
                this.loading = true;
            }
            if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
                this.loading = false;
            }
        });

        
    }

    get f() { return this.signinForm.controls; }

    onSubmit() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.signinForm.invalid) {
             return;
        }
        this.loading = true;
        this.loadingText = 'Accesso in corso...';
        this.authentication.login(this.signinForm.value.username, this.signinForm.value.password)
            .subscribe(res => {  
                    console.log(res);
                    this.loading = false;
                    this.authService.authenticated=true;
                    if (res.roles.indexOf('ROLE_USER') > -1) {
                        this.router.navigateByUrl('/manageProduct');  
                    }
                    if (res.roles.indexOf('ROLE_ADMIN') > -1) {
                        this.router.navigateByUrl('/creazioneazienda');  
                    }             
                }, err => {
                    console.log(err);
                    this.loading = false;                   
                    this.toastr.error("Username o password non valido");
                    this.loadingText = 'Riprova';
                }

            );
    }


}
