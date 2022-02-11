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

@Component({
  selector: 'app-stato-gift',
  templateUrl: './stato-gift.component.html',
  styleUrls: ['./stato-gift.component.scss']
})
export class StatoGiftComponent implements OnInit {

  loading;
  loadingS;
  statoGiftForm : FormGroup;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  listaNegozi : string[] = [];
  listaStatus : string[] = [];
  listaTipi : string[] = [];
  giftStatusRequest : GiftStatusRequest = null;
  listaGift : GiftDetails[] = [];
  filtroAvanzato : boolean = false;
  loadingText = "Attendi...";
  datePlaceholder = "";
  listaMovimentiGift : GiftMovementsDetails[] = [];
  submitted :boolean = false;
  filtraPerData : boolean = false;
  
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
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    this.datePlaceholder = "Tra il " + this.fromDate.day + "/" + this.fromDate.month + "/" + this.fromDate.year + "  ed il " + this.toDate.day + "/" + this.toDate.month + "/" + this.toDate.year ;
    //this.submitted = false;
    this.statoGiftForm = this.fb.group({
      negozio: ['', Validators.required],
      status : ['', Validators.required],
      type : ['', Validators.required],
      gnumber : ['', Validators.required]

   });

  }

  ngOnInit() {

    this.listaTipi.push("VOUCHER");
    this.listaTipi.push("GIFT CARD");
    this.listaTipi.push("GIFT STORE");
    this.getListaNegozi();
    this.getListaStatus();
    
  }

  get f() {return this.statoGiftForm.controls}

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

  changeDatePlaceholder(fromDate, toDate) : string {
    let datePlaceholder = "Tra il " + fromDate.day + "/" + fromDate.month + "/" + fromDate.year;
    if(toDate){
      datePlaceholder += " ed il " + toDate.day + "/" + toDate.month + "/" + toDate.year ;
    } 
    return datePlaceholder;
  }

  attivaFiltroAvanzato(){
    this.filtroAvanzato = !this.filtroAvanzato;
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

  getListaStatus() {

    this.http.get<any[]>(`${environment.apiUrl}giftcard/getlistastatus`)
    .subscribe(
      res => {
        console.log(res)
        this.listaStatus = res;
        this.listaStatus.shift();
      },
      err => {
        console.log(err)
      })

  }

  cercaPerGNumber() {
    this.listaGift = [];
    this.loading = true;
    this.http.post<GiftDetails[]>(`${environment.apiUrl}giftcard/getgiftbygnumber`, this.statoGiftForm.controls.gnumber.value).subscribe(res => {
      console.log(res);
      if (res != null){
      this.listaGift = res;
      }
      else {
        this.toastr.error('Nessuna GIFTCARD trovata!','GIFT N°',{progressBar: false});          
      }
      this.loading = false;
    }, err => {
      this.toastr.error('Nessuna GIFTCARD trovata!','GIFT N°.',{progressBar: false});
      console.log(err);
      this.loading = false;
    })

  }

  stampa(){

    
      var printContents = document.getElementById("tabellaDaStampare").innerHTML;
      var popupWin = window.open('', '_blank', 'width=300,height=300');
      popupWin.document.open();
      popupWin.document.write('<html><head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">      </head><body onload="window.print();">' + printContents + '</body></html>');
      popupWin.document.close();

  }

  cerca() {

    this.loadingS = true;

    var giftRequest : GiftStatusRequest = new GiftStatusRequest();
    giftRequest.negozio = this.statoGiftForm.controls.negozio.value;
    if(this.filtraPerData){
    giftRequest.from_date = new Date(this.fromDate.month + "/" + this.fromDate.day + "/" + this.fromDate.year);
    giftRequest.to_date = new Date(this.toDate.month + "/" + this.toDate.day + "/" + this.toDate.year);
    }
    else{
    giftRequest.from_date = new Date("05/05/2000");
    giftRequest.to_date = new Date("05/05/2100");
    }
    giftRequest.status = this.statoGiftForm.controls.status.value;
    giftRequest.type = this.statoGiftForm.controls.type.value;

    console.log(giftRequest);

    this.http.post<GiftDetails[]>(`${environment.apiUrl}giftcard/getallgiftbycustomfilter`, giftRequest).subscribe(res => {
      console.log(res);
      if(res.length !== 0){
          this.listaGift= res;
        } else {
          this.toastr.error('Nessuna GIFTCARD trovata!','GIFT N°',{progressBar: false});          
        }
        this.loadingS = false;
    }, err => {
      console.log(err);
      this.toastr.error('Nessuna GIFTCARD trovata!','GIFT N°',{progressBar: false});
      this.loadingS = false;
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

  openLg(content, gnumber) {

    console.log(gnumber)
    this.http.post<GiftMovementsDetails[]>(`${environment.apiUrl}giftcard/getgiftmovementsbygnumber`, gnumber).subscribe(res => {
      console.log(res);
      this.listaMovimentiGift = res;
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });

    this.modalService.open(content, { ariaLabelledBy: 'modalsos', size: 'lg' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

  submit(){
    this.cercaPerGNumber();
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

}

