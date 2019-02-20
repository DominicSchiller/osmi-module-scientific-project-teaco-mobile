import { NgModule } from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import { AddParticipantPage } from './add-participant';
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
  declarations: [
    AddParticipantPage,
  ],
  imports: [
    IonicModule,
    ComponentsModule,
    IonicPageModule.forChild(AddParticipantPage),
  ],
})
export class AddParticipantModule {}
