import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddParticipantPage } from './add-participant';

@NgModule({
  declarations: [
    AddParticipantPage,
  ],
  imports: [
    IonicPageModule.forChild(AddParticipantPage),
  ],
})
export class AddParticipantPageModule {}
