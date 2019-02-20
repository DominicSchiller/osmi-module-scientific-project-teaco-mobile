import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {Button, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  private showLoginPage() {
    this.navCtrl.push(
        'LoginPage',
        null,
        {animate:true,animation:'transition',duration:500,direction:'forward'}
    ).then();
  }

  private showRegistrationPage() {
    this.navCtrl.push(
        'RegistrationPage',
        null,
        {animate:true,animation:'transition',duration:500,direction:'forward'}
    ).then();
  }

}
