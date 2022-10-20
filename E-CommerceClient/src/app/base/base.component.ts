import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';


export class BaseComponent {

    constructor(private spinner:NgxSpinnerService) {     
    }
    showSpinner(spinnerNameType: SpinnerType){
        this.spinner.show(spinnerNameType); 
        setTimeout(()=>this.hideSpinner(spinnerNameType),1000) ;         
    }
    hideSpinner(nameSpinnerType: SpinnerType){
        this.spinner.hide(nameSpinnerType);           
    }
}

export enum SpinnerType {
    SquareLoader="s1",
    Pacman="s2",
    BallFussion="s3"
}
