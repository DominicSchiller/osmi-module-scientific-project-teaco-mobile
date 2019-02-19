import {Component, forwardRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserSessionProvider} from "../../../providers/user-session/user-session";
import {TeaCoApiProvider} from "../../../providers/teaco-api/teaco-api-provider";
import {LoadingIndicatorComponent} from "../../../components/general/loading-indicator/loading-indicator";

/**
 * Generated class for the RegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {
  /**
   * loading indicator UI component
   */
  @ViewChild(forwardRef(() => LoadingIndicatorComponent)) loadingIndicator: LoadingIndicatorComponent;

  private email: string;
  private name: string;
  private errorMsg: string;
  private isQualifiedEmail: boolean;
  private isRegistrationSuccess: boolean;

  constructor(
      private navCtrl: NavController,
      private navParams: NavParams,
      private userSession: UserSessionProvider,
      private apiService: TeaCoApiProvider) {
    this.email = "";
    this.name = "";
    this.errorMsg = "";
    this.isQualifiedEmail = false;
    this.isRegistrationSuccess = false;
  }

  private onEmailEntered(event) {
    this.email = event[0];

    // check if qualified email address
    let atIndex = this.email.indexOf('@'); // index of @ sign
    let dotIndex = this.email.lastIndexOf('.');
    let domain = this.email.substring(atIndex+1, dotIndex);
    let countryCode = this.email.substr(dotIndex+1);
    this.isQualifiedEmail =
        atIndex > 0 &&
        dotIndex > 0 &&
        atIndex < dotIndex &&
        domain.length >=3 &&
        countryCode.length >= 2;
  }

  private onNameEntered(event) {
    this.name = event[0];
  }

  /**
   * Show error message for failed user retrieval.
   */
  private showErrorMessage() {
    this.errorMsg = "Es ist bereits schon ein Konto unter dieser E-Mail-Addresse registriert. Bitte überprüfe Deine Eingabe.";
    setTimeout(() => {
      this.errorMsg = "";
    }, 4000);
  }

  /**
   * Hide the currently visible loading indicator.
   */
  private hideLoadingIndicator() {
    setTimeout( () => {
      this.loadingIndicator.hide();
    }, 400);
  }

  /**
   * Register new user account.
   */
  private register() {
    this.loadingIndicator.show();
    this.apiService.createUser(this.name, this.email)
        .subscribe(user => {
          this.userSession.setActiveUser(user);
          this.isRegistrationSuccess = true;
          this.hideLoadingIndicator();
        }, error => {
          this.showErrorMessage();
          this.hideLoadingIndicator();
        });
  }

  /**
   * Finish registration process.
   */
  private finish() {
    this.navCtrl.push('MeetingsOverviewPage').then();
  }

}
