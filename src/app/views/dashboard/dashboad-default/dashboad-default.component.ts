import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Grafici } from 'src/app/model/Grafici';
import { Histogram } from 'src/app/model/Histogram';
import { ProductService } from 'src/app/shared/services/product.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-dashboad-default',
	templateUrl: './dashboad-default.component.html',
  styleUrls: ['./dashboad-default.component.css']
})
export class DashboadDefaultComponent implements OnInit {

  giftcardChartOptions : any;
  histogramData : Histogram[] = [];
  graficiData : Grafici[] = [];
  moduleLoading : boolean = false;
  moduleLoading2 : boolean = false;
  loading;
  
  constructor(
    private productService: ProductService,
    private modalService: NgbModal,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.getGraphByMonthYear();
    this.getOtherGraph();
  }

  getGraphByMonthYear(){
    let meseCorrente = (new Date().getMonth()+1).toString();
    let annoCorrente = new Date().getFullYear().toString();

    this.moduleLoading = true;

    this.http.get<Histogram[]>(`${environment.apiUrl}giftcard/getHistogram/` + annoCorrente + "/" + meseCorrente).subscribe(res => {
      console.log(res);
      this.histogramData = res;
      this.loading = false;
      this.moduleLoading = false;
      this.setOptions();
    }, err => {
      console.log(err);
      this.loading = false;
      this.moduleLoading = false;
    });

  }

  getOtherGraph(){

    let meseCorrente = (new Date().getMonth()+1).toString();
    let annoCorrente = new Date().getFullYear().toString();

    this.moduleLoading2 = true;

    this.http.get<Grafici[]>(`${environment.apiUrl}giftcard/getGrafici/` + annoCorrente + "/" + meseCorrente).subscribe(res => {
      console.log(res);
      this.graficiData = res;
      this.loading = false;
      this.moduleLoading2 = false;
      this.setOptions();
    }, err => {
      console.log(err);
      this.loading = false;
      this.moduleLoading2 = false;
    });

  }

  setOptions() {
    this.giftcardChartOptions = {
      color: ['#000'],
      title: {
        text: 'GIFTCARD ATTIVATE',
      },
      legend: {
        data: ['Gift attivate'/*, 'Recovered', 'Deaths'*/]
      },
      tooltip: {
      },
      xAxis: {
        data: this.histogramData.map(c => new Date(c.days).toLocaleDateString()),
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'Gift attivate',
        type: 'bar',
        data: this.histogramData.map(c => c.valore),
      }/*,
      {
        name: 'Recovered',
        type: 'bar',
        data: this.histogramData.map(c => c.valore),
      },
      {
        name: 'Deaths',
        type: 'bar',
        data: this.histogramData.map(c => c.valore),
      },*/
      ]
    };
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log('Errore!', reason);
    });
  }

}
