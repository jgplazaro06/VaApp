import { Component, OnInit } from '@angular/core';
import { HttpModule, Http, RequestOptions, Headers, URLSearchParams } from '@angular/http'
import { NavController, NavParams, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HTTP } from '@ionic-native/http/ngx'

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.page.html',
	styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

	load: any;
	notifs: any;
	curTime: any;
	options: any;

	constructor(
		private http: Http,
		private loadCtrl: LoadingController,
		public navCtrl: NavController,
		private router: Router,
		private nativeHttp: HTTP,
		private sanitizer: DomSanitizer
	) {
		this.options = new RequestOptions({
			headers: new Headers({
				'Content-Type': 'application/x-www-form-urlencoded'
			})
		});


		this.retrieveNotifs();
		this.curTime = new Date();
	}

	ngOnInit() {
	}

	retrieveNotifs() {
		this.loadCtrl.create({
			spinner: "crescent",
			message: "Loading..."
		}).then(loader => {
			this.load = loader;
			this.load.present();
		});

		// let body = `action=${encodeURIComponent("getOldsNews")}` +
		// 	`&count=20&page=1&language=en`;

		let body = new URLSearchParams();
		body.set('action', 'getOldsNews');
		body.set('count', '20');
		body.set('page', '1');
		body.set('language', 'en');



		this.http.post("http://cums.the-v.net/site.aspx",
			body,
			this.options)
			.subscribe(
				res => {

					this.notifs = res.json();
					console.log(this.notifs)
					this.notifs.forEach(item => {
						let reader = new FileReader();
						this.nativeHttp.sendRequest(item.ImageLink, { method: 'get', responseType: 'blob', data: {}, headers: {} })
							.then(result => {
								let data;
								reader.readAsDataURL(result.data);
								reader.onloadend = () => {
									data = reader.result
									// data = "data:image/jpeg;base64," + data;
									item.ImageLink = data
									item.ImageLink = this.sanitizer.bypassSecurityTrustResourceUrl(item['imgUrl'])

								}
							}, error => {
								console.log(error)
							})
					})
					this.load.dismiss();
				},
				err => {
					console.log(err);
					this.load.dismiss();
				}
			);
	}

	viewNotif(notifs) {
		let navParams: NavigationExtras = {
			state: {
				data: notifs
			}
		}
		this.router.navigate(['/single-notif'], navParams);
	}

	timeDiff(time) {
		let toRet = Math.floor((Date.parse(this.curTime) - Date.parse(time)) / 1000 / 60 / 60);

		if (toRet < 24)
			return toRet + " hrs ago";

		else
			return Math.floor(toRet / 24) + "d ago";
	}

}
