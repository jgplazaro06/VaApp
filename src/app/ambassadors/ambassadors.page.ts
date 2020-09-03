import { Component, OnInit } from '@angular/core';

import { Ambassador } from '../../models/ambassador.model';
import { NavController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-ambassadors',
  templateUrl: './ambassadors.page.html',
  styleUrls: ['./ambassadors.page.scss'],
})
export class AmbassadorsPage implements OnInit {

  upcomingFormat: Array<string>;
  ambassadors: Array<Ambassador> = new Array<Ambassador>();
  load: any;

  constructor(
    public navCtrl: NavController,
    private sqlite: SQLite,
    private loadCtrl: LoadingController
  ) {
    this.upcomingFormat = [
      "V FOUNDERS",
      "V PARTNERS",
      "ASSOCIATE V PARTNERS",
      "V COUNCILS"
    ];

  }

  ngOnInit() {
    this.retrieveData();

  }

  retrieveData() {
    this.loadCtrl.create({
      spinner: "crescent",
      message: "Loading..."
    }).then(loader => {
      this.load = loader;
      // loader.present()
    });

    this.loadCtrl.dismiss()

    // this.sqlite.create({
    //   name: "vapp.db",
    //   location: "default"
    // }).then((db: SQLiteObject) => {
    //   db.executeSql("select * from Ambassador", [])
    //     .then((val) => {
    //       for (let i = 0; i < val.rows.length; i++) {
    //         let holder: Ambassador = new Ambassador();
    //         holder.fromJson(val.rows.item(i));

    //         this.ambassadors.push(holder);
    //       }

    //       this.load.dismiss();
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       this.load.dismiss();
    //     });
    // });
  }

  categoryHandler(cat: string) {

    console.log(this.ambassadors)
    console.log(cat)
    let navParams: NavigationExtras = {
      state: {
        data: this.ambassadors,
        category: cat
      }
    }
    this.navCtrl.navigateForward(['/ambassador-category-holder'], navParams);
  }

}
