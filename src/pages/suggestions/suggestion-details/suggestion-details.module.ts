import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuggestionDetailsPage } from './suggestion-details';
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
  declarations: [
    SuggestionDetailsPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(SuggestionDetailsPage),
  ],
})
export class SuggestionDetailsPageModule {}
