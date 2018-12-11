import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TeaCoApiProvider } from "../../providers/teaco-api-provider/teaco-api-provider";
import {User} from "../../models/User";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private navCtrl: NavController) {
  }

}
