import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TeaCoApiProvider} from "../../providers/teaco-api-provider/teaco-api-provider";
import {User} from "../../models/User";

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

    private user: User;

    /**
     * Constructor
     * @param navCtrl The app's navigation controller
     * @param navParams The handed navigation params which should contain the user's key
     */
    constructor(private navCtrl: NavController, private navParams: NavParams, private zone: NgZone, private apiService: TeaCoApiProvider) {
        this.userKey = this.navParams.get('userKey');
        this.apiService.getUser(this.userKey).subscribe(user => {
            this.zone.run(() => {
                this.user = user;
            })
        })
    }
}