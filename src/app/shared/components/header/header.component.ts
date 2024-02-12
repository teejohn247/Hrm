import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() userDetails:any;
  userName:string;
  userRole:string;
  profilePhoto: string;

  constructor() { }

  ngOnInit(): void {
    if(this.userDetails.data.isSuperAdmin) {
      this.userName = this.userDetails.data.companyName + ' Company';
      this.userRole = 'Super Admin';
    }
    else {
      this.userName = this.userDetails.data.fullName;
      this.userRole = this.userDetails.data.companyRole;
      this.profilePhoto = this.userDetails.data.profilePic;
    }
  }
}
