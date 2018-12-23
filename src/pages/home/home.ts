import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TeaCoApiProvider } from "../../providers/teaco-api-provider/teaco-api-provider";
import {User} from "../../models/User";
import { AddNewMeetingPage } from '../add-new-meeting/add-new-meeting';
import { Meeting } from '../../models/Meeting';
import { Vote } from '../../models/Vote';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  meetings: Meeting [];
  
  constructor(private navCtrl: NavController, private apiService: TeaCoApiProvider) {
    // //TODO: just for testing purpose --> should be removed later on
     this.apiService.getAllMeetings("1").subscribe(meetings => {
       this.meetings = meetings;
      console.log(this.meetings);
     })

   
  }
  
  addNewMeetingPage(){
    this.navCtrl.push(AddNewMeetingPage);
  }
}
