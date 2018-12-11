import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewMeetingPage } from './add-new-meeting';

@NgModule({
  declarations: [
    AddNewMeetingPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewMeetingPage),
  ],
})
export class AddNewMeetingPageModule {}
