import { Component, OnInit } from '@angular/core';


import { Defaults } from '../objects';
import { Ambassador } from '../../models/ambassador.model';

import { NavController, IonRouterOutlet } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-ambassador-profile',
  templateUrl: './ambassador-profile.page.html',
  styleUrls: ['./ambassador-profile.page.scss'],
})
export class AmbassadorProfilePage implements OnInit {
  // content: Ambassador;
  // Defaults_: Defaults = new Defaults();
  isFounder: boolean = false;
  isPartner: boolean = false;
  isAssociatePartner: boolean = true;
  isCouncil: boolean = false;

  constructor(private aroute: ActivatedRoute,
    private router: Router) {
      // this.aroute.queryParams.subscribe(params => {
      //   if (this.router.getCurrentNavigation().extras.state) {
      //     this.content = this.router.getCurrentNavigation().extras.state.data;
      //   }
      // })
     }

  ngOnInit() {
  }

}
