import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { ProductWeb } from 'src/app/model/ProductWeb';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

  loading;
  loadingDel;
  loadingMod;
  loadingcsv;
  moduleLoading;
  ricercaProdForm: FormGroup;
  listProdParent: ProductWeb[] =[];
  listStagione : string[] = [];
  listBrand : string[] = [];
  
  
  submitted = false;
  
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr : ToastrService
  ) {

    this.ricercaProdForm = this.fb.group({
      id_woo_commerce : [''],
      codart : [''],
      stagione : [''],
      brand : ['']
    });
   
    
  }

  ngOnInit() {
    this.getListProdParent();
    this.getListStagione();
    this.getListBrand();
  }

  get f() { return this.ricercaProdForm.controls; }


  getListProdParent(){
    this.moduleLoading = true;
    let codart = this.ricercaProdForm.controls.codart.value;
    let id_woo = this.ricercaProdForm.controls.id_woo_commerce.value;
    let stagione = this.ricercaProdForm.controls.stagione.value;
    let brand = this.ricercaProdForm.controls.brand.value;
    const url = `${environment.apiUrl}retail/getProductsWebParent`;
    const params = new HttpParams().set('codart', codart).set('id_woo', id_woo).set('stagione', stagione).set('brand', brand);
  
    this.http.get<ProductWeb[]>(url, {params}).subscribe(res => {
        console.log(res);
        if (res.length!==0) {
          this.listProdParent= res;
        } else {
          this.toastr.error('Nessun prodotto trovato!','Product Web',{progressBar: false});
        }
        this.moduleLoading = false;
      },
      err =>{
        console.log(err);        
        this.moduleLoading = false;

      }
    )
  }


  getListStagione(){
    this.http.get<any[]>(`${environment.apiUrl}retail/getStagioni`)
    .subscribe(
      res =>{
        console.log(res);
        this.listStagione=res;
      },
      err =>{
        console.log(err);
      }
    )
  }


  getListBrand(){
    this.http.get<any[]>(`${environment.apiUrl}retail/getBrands`)
    .subscribe(
      res =>{
        console.log(res);
        this.listBrand=res;
      },
      err =>{
        console.log(err);
      }
    )
  }

  exportCSV(){
    this.loadingcsv = true;
    let codart = this.ricercaProdForm.controls.codart.value;
    let id_woo = this.ricercaProdForm.controls.id_woo_commerce.value;
    let stagione = this.ricercaProdForm.controls.stagione.value;
    let brand = this.ricercaProdForm.controls.brand.value;
  
    const url = `${environment.apiUrl}retail/getProductsWebParent`;
    const params = new HttpParams().set('codart', codart).set('id_woo', id_woo).set('stagione', stagione).set('brand', brand);
    this.http.get<ProductWeb[]>(url, {params})
    .subscribe(
      res =>{
        console.log(res);
        if(res.length!==0) {
          this.listProdParent= res;
          this.downloadCSV(this.listProdParent);
          this.loadingcsv = false;
        } else{
          this.toastr.error('Nessun prodotto trovato!','Product',{progressBar: false});
          this.loadingcsv = false;
        }
      },
      err =>{
        console.log(err);
        this.loadingcsv = false;
      }
    )
  }

  downloadCSV(data: any){
      const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
      const header = Object.keys(data[0]);
      let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
      csv.unshift(header.join(';'));
      let csvArray = csv.join('\r\n');
      var blob = new Blob([csvArray], {type: 'text/csv' })
      saveAs(blob, "lista-prod.csv");
  }

 


  searchProduct(){
    this.submitted = true;
    let codart = this.ricercaProdForm.controls.codart.value;
    let id_woo = this.ricercaProdForm.controls.id_woo_commerce.value;
    let stagione = this.ricercaProdForm.controls.stagione.value;
    let brand = this.ricercaProdForm.controls.brand.value;
   
    
    if (this.ricercaProdForm.invalid) {
      return;
    }
    this.loading=true;
    const url = `${environment.apiUrl}retail/getProductsWebParent`;
    const params = new HttpParams().set('codart', codart).set('id_woo', id_woo).set('stagione', stagione).set('brand', brand);
    
    
    this.http.get<ProductWeb[]>(url, {params}).subscribe(res => {
      console.log(res);
      if(res){
          this.loading=false;
          this.listProdParent = res;
          this.toastr.success('Ricerca OK!','Info',{progressBar: false});          
      } else {
          this.loading=false;
          this.toastr.error('Errore nella ricerca prodotti!','Errore',{progressBar: false});
      }
     
    }, err => {
      console.log(err);
      this.toastr.error('Errore nella rocerca di prodotti!','Errore',{progressBar: false});
    })

  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log('Err!', reason);
    });
  }

  checkAll(ev) {
    this.listProdParent.forEach(x => x.checked = ev.target.checked)
  }

  isAllChecked() {
    return this.listProdParent.every(x => x.checked);
  }

  cancellaSelezionati(){
    
    const selectedProducts = this.listProdParent.filter(product => product.checked).map(p => p.id_woo_commerce);
    console.log(selectedProducts);
    if (selectedProducts.length > 0) {
      if (confirm("Sicuro di voler cancellare i prodotti selezionati?")) {
        this.loadingDel=true;
        const url = `${environment.apiUrl}retail/deleteproducts`;
        this.http.post<ProductWeb[]>(url, selectedProducts.join(',')).subscribe(
          res =>{
            console.log(res);
            if (res.length!==0) {
              this.listProdParent= res;
            } else {
              this.toastr.error('Nessun prodotto trovato!','Product Web',{progressBar: false});
            }
            this.moduleLoading = false;
            this.loadingDel=false;
            },
          err =>{
            console.log(err);        
            this.moduleLoading = false;
            this.loadingDel=false;
          }
        )
      } else {
        this.moduleLoading = false;
        this.loadingDel=false;
      }
    } else {
      this.toastr.error('Selezionare almeno un prodotto','Product Web',{progressBar: false});
    }
  }

  aggiornaSelezionati(){
    
    const selectedProducts = this.listProdParent.filter(product => product.checked).map(p => p.id_woo_commerce);
    console.log(selectedProducts)
    if (selectedProducts.length > 0) {
      if (confirm("Sicuro di voler aggiornare i prodotti selezionati?")) {
        this.loadingMod=true;
        const url = `${environment.apiUrl}retail/modifyproducts`;
        this.http.post<ProductWeb[]>(url, selectedProducts.join(',')).subscribe(
          res =>{
            console.log(res);
            if (res.length!==0) {
              this.listProdParent= res;
            } else {
              this.toastr.error('Nessun prodotto trovato!','Product Web',{progressBar: false});
            }
            this.moduleLoading = false;
            this.loadingMod=false;
            },
          err =>{
            console.log(err);        
            this.moduleLoading = false;
            this.loadingMod=false;
            this.toastr.error('Errore aggiornamento prodotti!','Errore',{progressBar: false});
          }
        )
      } else {
        this.moduleLoading = false;
        this.loadingMod=false;
      }
  } else {
    this.toastr.error('Selezionare almeno un prodotto','Product Web',{progressBar: false});
  }

  }

}




