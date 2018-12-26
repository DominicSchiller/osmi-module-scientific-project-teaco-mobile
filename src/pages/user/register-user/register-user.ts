import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TeaCoApiProvider } from "../../../providers/teaco-api/teaco-api-provider";
import { LoadingIndicatorComponent } from "../../../components/loading-indicator/loading-indicator";
import { TabsPage } from "../../tabs/tabs";
import { UserSessionProvider } from "../../../providers/user-session/user-session";

/**
 * Page Controller for registering a user within the app
 * by his given unique user key.
 */
@Component({
    selector: 'page-register-user',
    templateUrl: 'register-user.html'
})
export class RegisterUserPage {

    /**
     * loading indicator UI component
     */
    @ViewChild(LoadingIndicatorComponent) loadingIndicator: LoadingIndicatorComponent;
    /**
     * The user's personal TeaCo key
     */
    private readonly userKey: string;
    /**
     * Status whether this page has been accessed via deep link or not
     */
    private isCalledByDeepLink = false;
    /**
     * Status whether the registration process succeeded or not
     */
    private isRegistrationSuccess = false;
    /**
     * User registration error message
     */
    private errorMsg: string;

    /**
     * Constructor
     * @param navCtrl The app's navigation controller
     * @param navParams The handed navigation params which should contain the user's key
     * @param zone The current template zone this controller refers to
     * @param apiService The TeaCo API Service to communicate with the TeaCo server
     * @param userSession The app's user session service
     */
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private zone: NgZone,
        private apiService: TeaCoApiProvider,
        private userSession: UserSessionProvider) {

        this.errorMsg = "";
        this.userKey = this.navParams.get('userKey');
        if(this.userKey != undefined) {
            this.isCalledByDeepLink = true;
            this.registerUserViaDeeplink();
        }
    }

    /**
     * Close the modal dialog.
     */
    private closeModal() {
        this.navCtrl.pop().then();
    }

    /**
     * Register the user by validating the entered personal key
     * against the TeaCo backend.
     */
    private registerUser() {
        this.loadingIndicator.show();
        this.apiService.getUser(this.userKey).subscribe(user => {
            this.zone.run(() => {
                this.userSession.activeUser = user;
                this.hideLoadingIndicator();
                this.showSuccessInformation();
            });
        }, error => {
            console.error(error);
            this.showErrorMessage();
            this.hideLoadingIndicator();
        });
    }

    /**
     * Trigger user registration from deep link.
     * Note: This function must be called with delay and asynchronously to ensure
     * it can be triggered directly from the constructor while the UI template has not be rendered.
     */
    private registerUserViaDeeplink() {
        setTimeout(() => {
            this.loadingIndicator.show();
        }, 100);
    }

    /**
     * Finish the registration process and navigate to the
     * meetings overview page.
     */
    private finishRegistration() {
        this.navCtrl.pop().then(() => {
            this.navCtrl.setRoot(TabsPage).then();
        });
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
     * Show error message for failed user retrieval.
     */
    private showErrorMessage() {
        this.errorMsg = "Es konnte kein Konto unter diesem Key gefunden werden. Bitte überprüfen Sie Ihre Eingabe.";
        setTimeout(() => {
            this.errorMsg = "";
        }, 4000);
    }

    /**
     * Show registration success information.
     */
    private showSuccessInformation() {
        setTimeout( () => {
            this.isRegistrationSuccess = true;
        }, 600);
    }
}