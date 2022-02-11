import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/shared/services/product.service';
import { Router } from '@angular/router';
import { PassDataService } from 'src/app/pass-data.service';
import { GiftStatusRequest } from 'src/app/model/GiftStatusRequest';
import { environment } from 'src/environments/environment';
import { GiftDetails } from 'src/app/model/GiftDetails';
import { saveAs } from 'file-saver';
import { GiftMovementsDetails } from 'src/app/model/GiftMovementsDetails';
import { ToastrService } from 'ngx-toastr';
import { GiftToAssign } from 'src/app/model/GiftToAssign';
import { AssignGiftRequest } from 'src/app/model/AssignGiftRequest';

@Component({
  selector: 'app-assegna-gift',
  templateUrl: './assegna-gift.component.html',
  styleUrls: ['./assegna-gift.component.scss']
})
export class AssegnaGiftComponent implements OnInit {

  loading;
  loadingS;
  moduleLoading;
  statoGiftForm : FormGroup;
  submitted :boolean = false;
  listaGiftDaAssegnare : GiftToAssign[] = [];
  listaNegozi : string[] = [];
  
  constructor(
    public formatter: NgbDateParserFormatter,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private dataservice: PassDataService,
    private toastr: ToastrService
  ) {
    
    this.statoGiftForm = this.fb.group({
      negozio: ['', Validators.required]
   });

  }

  ngOnInit() {
    this.getGiftToAssign();
    this.getListaNegozi();
  }

  getListaNegozi(){
    this.http.get<any[]>(`${environment.apiUrl}giftcard/getlistanegozi`)
    .subscribe(
      res => {
        console.log(res)
        this.listaNegozi = res;
      },
      err => {
        console.log(err)
      })
  }

  getGiftToAssign(){

    this.moduleLoading = true;

    this.http.get<GiftToAssign[]>(`${environment.apiUrl}giftcard/getgifttoassign`).subscribe(res => {
      console.log(res);
      this.listaGiftDaAssegnare = res;
      this.loading = false;
      this.moduleLoading = false;
    }, err => {
      console.log(err);
      this.loading = false;
      this.moduleLoading = false;
    });
  }
  
  assegnaGift(package_no){

    this.loadingS = true;
    this.moduleLoading = true;

    let assegnaGiftRequest : AssignGiftRequest = new AssignGiftRequest(); 
    assegnaGiftRequest.package_no = package_no;
    assegnaGiftRequest.idstore = this.statoGiftForm.controls.negozio.value;

    console.log(assegnaGiftRequest);

    this.http.post<any>(`${environment.apiUrl}giftcard/assigngift`, assegnaGiftRequest).subscribe(res => {

      console.log(res);
      this.loadingS = false;
      this.moduleLoading = false;
      this.toastr.success('Gift assegnate allo store con successo!','Info',{progressBar: false});          
      this.getGiftToAssign();

    }, err => {
      this.loadingS = false;
      this.moduleLoading = false;
      console.log(err);
      this.toastr.error('Errore durante assegnazione delle Gift!','Errore',{progressBar: false});

    })

  }

  filtra(){

    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("filtro");
    filter = input.value.toUpperCase();
    table = document.getElementById("tabellaDaFiltrare");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  
  }

  openLg(content, package_no) {

    console.log("gnumber"+package_no)
    
    this.modalService.open(content, { ariaLabelledBy: 'modalsos', size: 'lg' })
      .result.then((result) => {
        this.assegnaGift(package_no);
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }


}

  



