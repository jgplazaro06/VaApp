import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-footer-tab',
  templateUrl: './footer-tab.component.html',
  styleUrls: ['./footer-tab.component.scss'],
})
export class FooterTabComponent implements OnInit {

  tabPages: Array<{ title: string, component: string, icon: string }>
  constructor(private navCtrl: NavController) {
    this.tabPages = [
      { title: "Home", component: '/home', icon: 'calendar' },
      { title: "Travel Request", component: '/travel-request', icon: 'contacts' },
      { title: "V Ambassadors", component: '/ambassadors', icon: 'map' },
    ]
  }

  ngOnInit() { }

  footerTabClick(page: string) {
    this.navCtrl.navigateRoot(page);
    

  }
}
