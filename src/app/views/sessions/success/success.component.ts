import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  key: string;
  success: boolean;

  constructor(private route: ActivatedRoute,private http: HttpClient) { 
    this.route.queryParams.subscribe(params => {
      this.key = params['key'];
  });
  }

  ngOnInit(): void {
      console.log(this.key);
  }
  confirmEmail(){
    this.http.get<any>(`${environment.apiUrl}auth/confirmMail/${this.key}`).subscribe(
      res => {
        //qua se success devi mostrare email confermata e blalabla
        this.success = true;
      },
      err => {
        //se errore devi mostrare errore
        this.success = false;
        console.log((err));
      }
    )
  }

}
