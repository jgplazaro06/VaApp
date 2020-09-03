import { Component, Optional } from '@angular/core';
import { Platform, NavController, MenuController, Events, AlertController, IonRouterOutlet } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import { LoginEvents } from '../../events/login-event';
import { HomeEvent } from '../../events/home-event';
import { User } from '../../models/user.model';
import { BackButtonService } from '../back-button.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  unregisterBack: any;
  user: User;
  hasAccount: boolean = false;
  isSuperuser: boolean = false;
  kind: boolean = false;

  constructor(
    @Optional() private routerOutlet: IonRouterOutlet,
    private platform: Platform,
    public navCtrl: NavController,
    public menu: MenuController,
    private event: Events,
    private storage: Storage,
    private sqlite: SQLite,
    private alertCtrl: AlertController,
    private bckBtnSrvc: BackButtonService
  ) {

    // platform.backButton.subscribeWithPriority(0, () => {
    //   if (!this.bckBtnSrvc.alertShown) {
    //     if (this.routerOutlet.canGoBack) {
    //       this.routerOutlet.pop();
    //     }
    //     else {
    //       console.log("else")
    //       this.bckBtnSrvc.presentConfirm();
    //       this.bckBtnSrvc.confirmAlert.present().then(() =>
    //       this.bckBtnSrvc.alertShown = true)
    //     }
    //   }
    // })

    this.event.subscribe(HomeEvent.EVENT_CHANGE, _ => {
      this.storage.get("user")
        .then((val: User) => {
          this.user = val;

          this.isSuperuser = val.Type;
          this.kind = val.Class;
          this.hasAccount = true;
        })
    });

    this.storage.get("user")
      .then((val: User) => {
        if (val == undefined || val == null) {
          this.sqlite.create({
            name: "vapp.db",
            location: "default"
          }).then((db: SQLiteObject) => {
            db.executeSql("select * from UserData", [])
              .then((val) => {
                if (val.rows.length > 0) {
                  this.kind = val.rows.item(0).Keynum == 9;

                  let user = new User();
                  user.fromJson(val.rows.item(0), this.kind);

                  this.storage.set("user", user);
                  LoginEvents.stateChanged(this.event);

                  this.hasAccount = true;
                  this.isSuperuser = user.Type;
                }
              })
              .catch((err) => console.log(err));
          });
        }

        else {
          this.user = val;

          this.hasAccount = true;
          this.isSuperuser = val.Type;
          this.kind = val.Class;
        }
      });
  }

  openPage(link: string, accessible: boolean) {
    if (accessible || this.hasAccount) {

      let navParams: NavigationExtras = {
        state: {
          data: this.user
        }
      }
      this.navCtrl.navigateRoot(link, navParams);
    }

    else {
      this.alertCtrl.create({
        header: "",
        subHeader: "You need to log-in to access this page",
        buttons: ["OK"]
      }).then(alert => alert.present());
    }
  }

}
