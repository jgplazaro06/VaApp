import { Component, OnInit } from '@angular/core';
import { HttpModule, Http, RequestOptions, Headers, URLSearchParams } from '@angular/http'
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Defaults } from '../objects';

import { User } from '../../models/user.model';
@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage implements OnInit {
	Defaults_: Defaults = new Defaults(); 

  videos: any;
  load: any;
  cond: boolean = false;
  options: any;

  constructor(
    public navCtrl: NavController,
    private http: Http,
    private loadCtrl: LoadingController,
    private storage: Storage,
    private alertCtrl: AlertController
  ) {

    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });

    this.storage.get("user")
      .then((val: User) => {
        if (val != undefined && Object.keys(val).length > 0) {
          this.cond = true;
        }
      }).catch(err => console.log(err));

  }


  ngOnInit() {
    this.postRetrieve();
  }

  postRetrieve() {
    this.loadCtrl.create({
      spinner: "crescent",
      message: "Loading..."
    }).then(loader => {
      loader.present()
      this.load = loader;
    });

    // let body = `action=${encodeURIComponent("Video_GetSearch")}` +
    //   `&word=${encodeURIComponent("V Ambassador")}` +
    //   `&count=${encodeURIComponent("4")}` +
    //   `&page=${encodeURIComponent("1")}`;

    let body = new URLSearchParams();
    body.set('action', 'Video_GetSearch');
    body.set('word', 'V Ambassador');
    body.set('count', '4');
    body.set('page', '1');

    this.http.post('http://cums.the-v.net/site.aspx', body, this.options)
      .subscribe(
        res => {
          this.videos = res.json();
          this.load.dismiss();
        },
        err => {
          console.log("error:" + err);
        }
      );
  }

  selectVideo(vid) {
    if (this.cond) {

      let navParams: NavigationExtras = {
        state: {
          data: vid
        }
      }

      this.navCtrl.navigateForward(['/single-video'], navParams);
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
