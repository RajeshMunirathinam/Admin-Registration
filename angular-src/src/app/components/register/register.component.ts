import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }
    // Required Fields
    if(!this.validateService.validateRegister(user)) {
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      
      return false;
    }

    // Validate Email
    if(!this.validateService.validateEmail(user.email)) {
    this.flashMessage.show('Please use a valid email', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    // Validate Password
    if(!this.validateService.validatePassword(user.password)) {
      this.flashMessage.show('Please use a valid Password', {cssClass: 'alert-danger', timeout: 3000});
        return false;
    }

    if(!this.validateService.validateName(user.name)) {
      this.flashMessage.show('Please Enter a valid Name', {cssClass: 'alert-danger', timeout: 3000});
        return false;
    }
    if(!this.validateService.validateUserName(user.username)) {
      this.flashMessage.show('Please Enter a valid UserName', {cssClass: 'alert-danger', timeout: 3000});
        return false;
    }
    


    // Register user
    this.authService.registerUser(user).subscribe(data => {
    if(data.success) {
     
      this.flashMessage.show('You are now registered and Check ur mail id to Activate your Account', {cssClass: 'alert-success', timeout: 5000, });
      this.router.navigate(['/login']);
    } else {
      this.flashMessage.show('Your Email-Id is already registered  ', {cssClass: 'alert-danger', timeout: 3000});
      this.router.navigate(['/register']);
    }
  });
 

  }
}
