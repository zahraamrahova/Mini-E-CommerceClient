import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, _MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { List_Product } from '../../../../contracts/list_product';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { ProductService } from '../../../../services/common/models/product.service';
declare var $:any;
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(private productService: ProductService, spinner: NgxSpinnerService, private alertify: AlertifyService) {
    super(spinner);

}
  
  displayedColumns: string[] = ['name', 'stock', 'price', 'createdDate', 'updatedDate', 'edit','delete' ];
  dataSource: MatTableDataSource<List_Product> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  async getProducts() {
    this.showSpinner(SpinnerType.SquareLoader);
    const allProducts: {totalCount:number; products:List_Product[]} = await this.productService.read(this.paginator? this.paginator.pageIndex : 0, 
      this.paginator? this.paginator.pageSize : 5,() => this.hideSpinner(SpinnerType.SquareLoader), errorMessage =>
      this.alertify.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      }))
      console.log(allProducts);
    this.dataSource = new MatTableDataSource<List_Product>(allProducts.products);
    this.paginator.length= allProducts.totalCount;
  }
  async pageChanged(){
    await this.getProducts();
  }
  async ngOnInit() {
    await this.getProducts();
  }
}
