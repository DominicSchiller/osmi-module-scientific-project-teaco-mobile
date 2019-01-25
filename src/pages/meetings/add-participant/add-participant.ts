import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the AddParticipantPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-participant',
  templateUrl: 'add-participant.html',
})
export class AddParticipantPage {

  /**
   * The page's navigation bar UI element
   */
  @ViewChild(Navbar) navBar: Navbar;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
      // todo something
      this.goBack();
    }
  }

  /**
   * Navigate back to the previous screen
   */
  goBack() {
    this.navCtrl.pop(
        {animate:true,animation:'transition', direction:'back'}).then();
  }

}
