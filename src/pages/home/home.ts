import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TeaCoApiProvider } from "../../providers/teaco-api-provider/teaco-api-provider";
import {User} from "../../models/User";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private user: User;

  constructor(private navCtrl: NavController, apiService: TeaCoApiProvider) {
    apiService.getUser("1")
        .subscribe(user => {
          this.user = user;
        });
  }

}
