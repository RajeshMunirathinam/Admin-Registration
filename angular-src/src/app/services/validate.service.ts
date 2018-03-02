import { Injectable } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';



@Injectable()
export class ValidateService {

  constructor(    private flashMessage: FlashMessagesService) { }

  validateRegister(user) {
    
    if(user.name == undefined || user.email == undefined || user.username == undefined || user.password == undefined) {
        return false;
    } else {
      return true;
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  validatePassword(password) {
    const re1 = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%></!^&*()]).{4,20})/;
    return re1.test(password);
  }

  validateName(name) {
   const re2 = /^[A-Za-z]+(?:[ _-][A-Za-z]+)*$/;
  // const re2 = /((?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%></!^&*() ]))/;
    return re2.test(name);
  }
  validateUserName(username) {
    const re3 = /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/;
   //const re3 = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%></!^&*()]))/;
    return re3.test(username);
  }
}
