import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly BaseURI = "http://localhost:60936/api";
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  formModel = this.fb.group({
    UserName : ['',Validators.required],  //these are Form Control
    Email : ['',Validators.email],
    Name : [''],
    Passwords : this.fb.group({
    Password : ['',[Validators.required,Validators.minLength(4)]],
    ConfirmPassword : ['',Validators.required]
    },{validators: this.comparePasswords })
  });


  comparePasswords(fb: FormGroup){
    let ConfirmPasswordCtrl = fb.get('ConfirmPassword');
    if(ConfirmPasswordCtrl.errors == null || 'passwordMismatch' in ConfirmPasswordCtrl.errors){
      if(fb.get('Password').value != ConfirmPasswordCtrl.value){
        ConfirmPasswordCtrl.setErrors({passwordMismatch: true});
      }
      else
        ConfirmPasswordCtrl.setErrors(null);
    }
  }

  register(){
    var body = {
      UserName : this.formModel.value.UserName,
      Email : this.formModel.value.Email,
      Name : this.formModel.value.Name,
      Password : this.formModel.value.Passwords.Password,
    }
    return this.http.post(this.BaseURI + "/ApplicationUser/Register", body);
  }

  login(formData){
    return this.http.post(this.BaseURI + "/ApplicationUser/Login", formData)
  }

  getUserProfile(){
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer' + localStorage.getItem('token')});
    return this.http.get(this.BaseURI + "/UserProfile", { headers: tokenHeader });
  }


}
