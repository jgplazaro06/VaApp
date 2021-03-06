import { Component, OnInit } from '@angular/core';
import { Defaults } from '../objects';
import { User } from '../../models/user.model';
import { NavController, NavParams, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profile: User;
  Defaults_: Defaults = new Defaults();

  constructor(
    public navCtrl: NavController,
    private aroute: ActivatedRoute,
    private storage: Storage,
    private router: Router
  ) {
    this.storage.get("user")
				.then((val: User) => {
          console.log(val)
					if (val != undefined) {
						this.profile = val;
					}
				});
  }


  ngOnInit() {
  }

  edit() {
    let navParams: NavigationExtras = {
      state: {
        data: this.profile
      }
    }
    this.navCtrl.navigateForward(['/edit-power'], navParams);
  }

}
