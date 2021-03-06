import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';

import { Platform, NavController, LoadingController, Events, AlertController, IonRouterOutlet } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SqliteService } from '../services/sqlite.service';

import { Corporate } from '../../models/corporate.model'
@Component({
  selector: 'app-directory',
  templateUrl: './directory.page.html',
  styleUrls: ['./directory.page.scss'],
})
export class DirectoryPage implements OnInit {
  corporate: Array<Corporate> = new Array<Corporate>();

  type: 'GBD';
  viewTable = [];
  constructor(private sqlSvc: SqliteService,
    private apiSvc: ApiService,
    private loadCtrl: LoadingController) { }

  ngOnInit() {
    this.retrieveData().then(result => {
      console.log(this.corporate)
      this.corporate.forEach(item => {
        item['imgUrl'] = item['imgUrl'].replace('www.the-v.net', 'site.the-v.net')
      })
      this.viewTable = this.corporate.filter(function (row) {
        return row.Department == 'GBD'
      })
      console.log(this.viewTable)
    });

    // this.sqlSvc.getCorporatesData().then(result => {
    //   this.corporate = result
    //   console.log(result)
    //   this.viewTable = this.corporate.filter(function (row) {
    //     row.Department == 'GBD'
    //   })
    //   console.log(this.viewTable)
    // })
  }

  async retrieveData() {
    const loader = await this.loadCtrl.create({
      spinner: "crescent",
      message: "Loading..."
    });
    await loader.present();
    let holder = await this.sqlSvc.getCorporatesData();
    console.log(holder)
    if (holder.length == 0) {
      //load from api then save to sqlite
      this.corporate = await this.apiSvc.getAllCorp();
      await loader.dismiss();
    } else {
      for (let i = 0; i < holder.length; i++) {
        let item = holder.item(i);
        // do something with it

        this.corporate.push(item);
      }
      // this.corporate = holder;
      await loader.dismiss();
    }
  }

  changeView() {
    let department = this.type;
    console.log(department)
    this.viewTable = this.corporate.filter(function (row) {
      return row.Department == department
    })
  }
}
