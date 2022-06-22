import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(public service: UserService, private toastr : ToastrService, private router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('token')!=null){
      this.router.navigateByUrl('/home');
    }
    this.service.formModel.reset();
  }

  onSubmit(){
    this.service.register().subscribe(
      (res: any) => {
        if(res.succeeded){
          this.service.formModel.reset();
          this.toastr.success('New user created','Registration successfully!')
        } else {
          res.errors.forEach(element => {
            switch(element.code){
              case 'DuplicateUserName':
              this.toastr.error('UserName already exists','Registration failed!!')
                break;
              default:
               this.toastr.error(element.description,'Registration failed!!');
              break;
            }
          });
        }
      },
      err => {
        console.log(err);
      }
    )
  }

}
