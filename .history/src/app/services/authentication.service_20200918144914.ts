import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, Events } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { User } from 'src/models/user.model';
import { HTTP } from '@ionic-native/http/ngx'

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	authState = new BehaviorSubject(false);
	private u = new User();

	constructor(private storage: Storage, private platform: Platform, private http: Http, private nativeHttp: HTTP, private event: Events) {
		this.platform.ready().then(() => {
			//check if logged in
			this.ifLoggedIn();
		});
	}
	ifLoggedIn() {
		this.storage.get('user').then((response) => {
			if (response) {
				this.authState.next(true);
			}
		});
	}

	async logout() {
		await this.storage.remove('user');
		this.authState.next(false);
	}
	async login(username: string, password: string) {
		let options = new RequestOptions({
			headers: new Headers({
				'Content-Type': 'application/x-www-form-urlencoded'
			})
		});


		let body = new URLSearchParams();
		body.set('action', 'CheckLogin');
		body.set('username', username);
		body.set('password', password);
		console.log(body)
		const res = this.http.post('http://vaservice.the-v.net/site.aspx', body, options).toPromise();

		return res.then(
			(res) => {
				// console.log(res['_body'])
				// let testJson = res['_body']
				// testJson = JSON.parse(testJson)
				// console.log(testJson)
				// console.log(testJson[0])
				// console.log(testJson[0]['Data'])

				res = JSON.parse(res['_body'])


				if (res[0]['Data'] == 'false' || res[0]['Info'] == 'action is null' || res[0].length === 0) {
					this.authState.next(false);
					return false;
				} else {
					//let kind: boolean = Object.keys(res[0]).length == 9;
					//let user: User = new User();
					//user.fromJson(res[0], kind);
					console.log(res[0])
					let reader = new FileReader();
					if (res[0].Image.includes('http://the-v.net')) res[0].Image = res[0].Image.replace('http://the-v.net', 'http://site.the-v.net')

					this.nativeHttp.sendRequest(res[0].Image, { method: 'get', responseType: 'blob', data: {}, headers: {} })
						.then(result => {
							let data;
							reader.readAsDataURL(result.data);
							reader.onloadend = () => {
								data = reader.result
								// data = "data:image/jpeg;base64," + data;
								res[0].Image = data
								// amb['imgUrl'] = this.sanitizer.bypassSecurityTrustResourceUrl(amb['imgUrl'])
								this.storage.set('user', res[0]);

							}
						}, error => {
							console.log(error)
						})
					this.authState.next(true);
					return true;
				}
			},
			(err) => {
				this.authState.next(false);
				throw err;
			}
		);
	}

	async getUser() {
		const user = await this.storage.get('user');
		let kind = Object.keys(user).length == 9;
		this.u.fromJson(user, kind);

		return this.u;
	}

	isAuthenticated() {
		return this.authState.value;
	}
}
