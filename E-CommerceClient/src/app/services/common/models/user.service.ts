import { SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Token } from 'src/app/contracts/token/token';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { Create_User } from 'src/app/contracts/users/create_user';
import { User } from 'src/app/entities/user';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService, private toastrService: CustomToastrService) { }

  async create(user: User): Promise<Create_User> {
   const observable :Observable<Create_User| User>= this.httpClientService.post<Create_User | User>({
    controller: "users"
   }, user);
  return  await firstValueFrom(observable) as Create_User;
  }
  async login(userNameOrEmail:string, password:string, callBackFunction? :()=>void) : Promise<any>{
   const observable : Observable<any |TokenResponse>= this.httpClientService.post<any |TokenResponse>({
      controller: "users",
      action: "login"
    }, {userNameOrEmail, password})
    const tokenResponse: TokenResponse =await firstValueFrom(observable) as TokenResponse;
    if(TokenResponse){

      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      //localStorage.setItem("expiration", token.expiration.toString());

        this.toastrService.message("Login Successfully completed", "Successfull login", {
        messageType:ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
    }
      
    callBackFunction();
  }
  async googleLogin(user:SocialUser, callBackFunction?: () =>void): Promise <any>{
    const observable : Observable<SocialUser| TokenResponse> =this.httpClientService.post <SocialUser| TokenResponse>({
      action:"google-login",
      controller:"users"
    }, user);
    const tokenResponse:TokenResponse =await firstValueFrom(observable) as TokenResponse;
    if(tokenResponse){
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      this.toastrService.message("Login with Google succefully applied", "Google Login", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
    }
      callBackFunction();

  }
}
