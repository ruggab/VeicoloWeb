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
import { GiftDaAttivare } from 'src/app/model/GiftDaAttivare';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gift-da-attivare',
  templateUrl: './gift-da-attivare.component.html',
  styleUrls: ['./gift-da-attivare.component.scss']
})
export class GiftDaAttivareComponent implements OnInit {

  loading;
  statoGiftForm : FormGroup;
  listaNegozi : string[] = [];
  listaGift : GiftDaAttivare[] = [];
  loadingText = "Attendi...";
  
  
  constructor(
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private dataservice: PassDataService,
    private toastr: ToastrService
  ) {

    this.statoGiftForm = this.fb.group({
      negozio : ['', Validators.required]
   });

  }

  ngOnInit() {

    this.getListaNegozi();
    
  }

  downloadFile(data: any) {
    data = this.listaGift;
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs(blob, "lista-gift.csv");
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

  cerca() {

    this.listaGift = [];
    this.loading = true;

    this.http.get<GiftDaAttivare[]>(`${environment.apiUrl}giftcard/getgiftdaattivare/` + this.statoGiftForm.controls.negozio.value)
    .subscribe(
      res => {       
        if(res.length!==0) {
          this.listaGift= res;
        } else{
          this.toastr.error('Nessuna GIFTCARD trovata!','GIFT da Attivare',{progressBar: false});
        }
        this.loading = false;
      },
      err => {
        console.log("Gift da Attivare"+err);
        this.toastr.error('Nessuna GIFTCARD trovata!','GIFT da Attivare',{progressBar: false});
        this.loading = false;
      })


  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Errore!', reason);
      });
  }



  submit(){
    this.cerca();
  }

  
}

