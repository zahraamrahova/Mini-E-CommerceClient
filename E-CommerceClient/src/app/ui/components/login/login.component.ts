import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AuthService } from 'src/app/services/common/auth.service';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  constructor(private userService: UserService,  spinner: NgxSpinnerService, private authService: AuthService,
    private activatedRoute: ActivatedRoute, private router:Router,
    private socialAuthService: SocialAuthService ) { 
    super(spinner);
    this.socialAuthService.authState.subscribe(async (user: SocialUser) => {
      this.showSpinner(SpinnerType.SquareLoader);
      console.log(user);
      await this.userService.googleLogin(user, ()=>{
        this.authService.identityCheck();
        this.hideSpinner(SpinnerType.SquareLoader)
      });
    });
  }

  ngOnInit(): void {
  }

  async login(userNameOrEmail: string, password:string){
    this.showSpinner(SpinnerType.BallFussion);

      await this.userService.login(userNameOrEmail, password, ()=>{
        this.authService.identityCheck();
        this.activatedRoute.queryParams.subscribe(params=>{
            const returnUrl:string= params["returnUrl"];
            if(returnUrl)
              this.router.navigate([returnUrl]);
        });
        this.hideSpinner(SpinnerType.BallFussion)
      });
  }
}
