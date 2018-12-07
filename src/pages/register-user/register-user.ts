import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-register-user',
    templateUrl: 'register-user.html'
})
/**
 * Page Controller for registering a user within the app
 * by his given unique user key.
 */
export class RegisterUserPage {

    /**
     * The user's unique key
     */
    private userKey: string;

    /**
     * Constructor
     * @param navCtrl The app's navigation controller
     * @param navParams The handed navigation params which should contain the user's key
     */
    constructor(private navCtrl: NavController, private navParams: NavParams) {
        this.userKey = this.navParams.get('userKey');
    }
}