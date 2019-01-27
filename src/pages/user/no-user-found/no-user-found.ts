import { Component } from '@angular/core';
import {IonicPage, ModalController} from 'ionic-angular';
import {RegisterUserPage} from "../register-user/register-user";

@IonicPage({
  segment: 'welcome'
})
@Component({
  selector: 'page-no-user-found',
  templateUrl: 'no-user-found.html'
})
/**
 * Page Controller for informing that no
 * user account is registered yet to work with.
 */
export class NoUserFoundPage {

  /**
   * Constructor
   * @param modalCtrl The Ionic's default modal controller
   */
  constructor(private modalCtrl: ModalController) {}

  /**
   * Open the modal dialog to manually register a user by
   * his personal key.
   */
  openRegisterUserModal() {
    const modal = this.modalCtrl.create('RegisterUserPage');
    modal.present();
  }
}
