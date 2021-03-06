import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';
import { Ambassador } from '../../models/ambassador.model';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { httpFactory } from '@angular/http/src/http_module';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { UserAgent } from '@ionic-native/user-agent/ngx';

@Component({
  selector: 'app-ambassador-partners',
  templateUrl: './ambassador-partners.page.html',
  styleUrls: ['./ambassador-partners.page.scss'],
})
export class AmbassadorPartnersPage implements OnInit {
  vps = Array<Ambassador>();
  options;
  constructor(
    private sqlSvc: SqliteService,
    private router: Router,
    private http: Http,
    private userAgent: UserAgent,
    private sanitizer: DomSanitizer
  ) {
    // this.userAgent.set('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36')
    //   .then((res: any) => console.log(res))
    //   .catch((error: any) => console.error(error));

    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'text/html; charset=UTF-8'
      })
    });
  }

  ngOnInit() {
    this.sqlSvc.getAmbassadorsData({ title: 'VP' }).then(val => {
      // for (let i = 0; i < val.length; i++) {
      //   let item = val.item(i);
      //   // do something with it

      //   this.vps.push(item);
      // }
      this.vps = val;
      this.vps.forEach(item => {
        item['imgUrl'] = item['imgUrl'].replace('www.the-v.net', 'site.the-v.net')
        // item['imgUrl'] = this.sanitizer.bypassSecurityTrustResourceUrl(item['imgUrl'])

        // item['imgUrl'] = this.sanitizer.bypassSecurityTrustUrl(item['imgUrl'])
        item['imgUrl'] = this.imageCorrection(item['imgUrl'])
        console.log(item)
      })
      console.log(this.vps)
    })
  }

  moveToLanding(partner) {
    console.log(partner)

    let navParams: NavigationExtras = {
      state: {
        data: partner,
        id: partner.id
      }
    }
    // this.navCtrl.navigateForward(['/profile'], navParams);

    this.router.navigate(['/ambassador-profile'], navParams);
  }

  async imageCorrection(image) {

    let options =
      this.http.get(image).subscribe(result => {
        console.log(result)
      })

  }
}
