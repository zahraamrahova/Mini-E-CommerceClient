import { HttpErrorResponse } from '@angular/common/http';
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {  NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { DeleteDialogComponent, DeleteState } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { AlertifyOptions, AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { HttpClientService } from 'src/app/services/common/http-client.service';
declare var $:any;
@Directive({
  selector: '[appDelete]'
})
export class DeleteDirective {

  constructor(private element: ElementRef,
    private _renderer: Renderer2,
    private httpClientService: HttpClientService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private alertifyService: AlertifyService
    ) 
    {
    
      const img =_renderer.createElement("img");
      img.setAttribute("src", "../../../../../assets/delete.png");
      img.setAttribute("style","cursor:pointer ;" );
      img.width=25;
      img.height=25;
      _renderer.appendChild(element.nativeElement, img);
     }
     @Input () id: string;
     @Input () controller: string;
     @Output() callback :EventEmitter<any> = new EventEmitter();

     @HostListener("click")
    async  onclick(){
      this.openDialog(async ()=>{
        this.spinner.show(SpinnerType.SquareLoader);
        const td: HTMLTableCellElement=this.element.nativeElement;
       this.httpClientService.delete({
          controller: this.controller
       }, this.id).subscribe(data=>{
        $(td.parentElement).animate({
          opacity:0,
          left: "+=50",
          height: "toogle"
        }, 700, ()=>{
          this.callback.emit();
          this.alertifyService.message("Deleted Succefully!", {
              dismissOthers: true,
              messageType: MessageType.Success,
              position: Position.TopRight
          })
        });
       }, (errorResponse:HttpErrorResponse)=>{
        this.spinner.hide(SpinnerType.SquareLoader)
        this.alertifyService.message("There is some problem with delete operation", {
          dismissOthers: true,
          messageType: MessageType.Success,
          position: Position.TopRight
      })
       });
      });
     }

     openDialog(afterClose:any): void {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '250px',
        data: DeleteState.Yes,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result==DeleteState.Yes){
            afterClose();
        }
      });
    }
  }

