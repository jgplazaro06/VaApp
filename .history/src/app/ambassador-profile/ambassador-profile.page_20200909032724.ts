import { Component, OnInit } from '@angular/core';


import { Defaults } from '../objects';
import { Ambassador } from '../../models/ambassador.model';

import { NavController, IonRouterOutlet } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-ambassador-profile',
  templateUrl: './ambassador-profile.page.html',
  styleUrls: ['./ambassador-profile.page.scss'],
})
export class AmbassadorProfilePage implements OnInit {
  // content: Ambassador;
  // Defaults_: Defaults = new Defaults();
  ambassador;
  isFounder: boolean = false;
  isPartner: boolean = false;
  isAssociatePartner: boolean = false;
  isCouncil: boolean = false;

  constructor(private aroute: ActivatedRoute,
    private router: Router,
    private sqlSvc: SqliteService) {
    this.aroute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.ambassador = (this.router.getCurrentNavigation().extras.state.data);

        if (!this.ambassador.Image && this.ambassador.imgUrl) this.ambassador.Image = this.ambassador.imgUrl
        else this.ambassador.Image = '../../assets/profile.png'
        // this.sqlSvc.getAmbassadorsData({ id: this.ambassador.ID }).then(val => {
        //   console.log(val)
        // this.ambassador = val[0];
        console.log(this.ambassador)

        switch (this.ambassador.title) {
          case 'VF':
            this.isFounder = true;
            if (this.ambassador.Rank == '1') this.ambassador.Image = 'assets/imgs/btn-dato.png'
            else this.ambassador.Image = 'assets/imgs/btn-japa.png'
            break;
          case 'VP':
            this.isPartner = true;
            break;
          case 'AVP':
            this.isAssociatePartner = true;
            break;
          case 'VC': //possible removal if not needed
            this.isCouncil = true;
            break;
        }
        // })
      }
    })

  }

  ngOnInit() {
    this.aroute.params.subscribe(params => {

    })
  }

  imageError() {
    this.ambassador.Image = '../../assets/profile.png'
  }
}
