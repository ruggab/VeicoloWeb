import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../../services/navigation.service';
import { SearchService } from '../../../../services/search.service';
import { AuthService } from '../../../../services/auth.service';
import { AuthenticationService, User } from '../../../../../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-sidebar-large',
  templateUrl: './header-sidebar-large.component.html',
  styleUrls: ['./header-sidebar-large.component.scss']
})
export class HeaderSidebarLargeComponent implements OnInit {

    notifications: any[];
    user: User;

    constructor(
      private navService: NavigationService,
      public searchService: SearchService,
      private auth: AuthenticationService,
      private router: Router
    ) {
      
    }
  
    ngOnInit() {

      var utente = JSON.parse(localStorage.getItem('currentUser'));
      this.user = utente;
    }
  
    toggelSidebar() {
      const state = this.navService.sidebarState;
      if (state.childnavOpen && state.sidenavOpen) {
        return state.childnavOpen = false;
      }
      if (!state.childnavOpen && state.sidenavOpen) {
        return state.sidenavOpen = false;
      }
      // item has child items
      if (!state.sidenavOpen && !state.childnavOpen 
        && this.navService.selectedItem.type === 'dropDown') {
          state.sidenavOpen = true;
          setTimeout(() => {
              state.childnavOpen = true;
          }, 50);
      }
      // item has no child items
      if (!state.sidenavOpen && !state.childnavOpen) {
        state.sidenavOpen = true;
      }
    }
  
    signout() {
      this.auth.logout();
      
      this.router.navigateByUrl("/sessions/signin");
    }

    signup() {
      //this.auth.logout();
      
      this.router.navigateByUrl("/sessions/signup");
    }

    forgot() {
      //this.auth.logout();
      
      this.router.navigateByUrl("/sessions/forgot");
    }

}
