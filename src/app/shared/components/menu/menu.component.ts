import { Component, OnInit, Input } from '@angular/core';
import { navbarData, navbarDataReg, navbarDataManager } from 'src/app/core/constants/nav-data';
import { AuthenticationService } from '../../services/utils/authentication.service';
import { NotificationService } from '../../services/utils/notification.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() userDetails:any;
  collapsed = true;
  adminMenuData = navbarData;
  regMenuData = navbarDataReg;
  managerMenuData = navbarDataManager;

  currentLink = 'General';

  constructor(
    private authService: AuthenticationService, 
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    console.log(this.userDetails);
    if(this.userDetails.data.isSuperAdmin) {
      this.collapsed = false;
      this.currentLink = 'Dashboard';
    };
  }


  //Logout function
  logout() {
    this.notifyService.confirmAction({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.authService.logout();
      }
    });
  }

}
