import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import { TeaCoApiProvider } from "../../../../providers/teaco-api/teaco-api-provider";
import { AddNewMeetingPage } from '../../add-new-meeting/add-new-meeting';

@Component({
  selector: 'page-open-meetings-overview',
  templateUrl: 'open-meetings-overview.html'
})
export class OpenMeetingsOverviewPage {

  constructor(private navCtrl: NavController, private apiService: TeaCoApiProvider) {
    // //TODO: just for testing purpose --> should be removed later on
    // this.apiService.getAllMeetings('1').subscribe(meetings => {
    //   console.log(meetings);
    // })
  }
  
  addNewMeetingPage(){
    this.navCtrl.push(AddNewMeetingPage);
  }
}
