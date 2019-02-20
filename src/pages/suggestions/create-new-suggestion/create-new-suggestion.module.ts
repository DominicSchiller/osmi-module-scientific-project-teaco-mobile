import { NgModule } from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {CreateNewSuggestionPage} from "./create-new-suggestion";
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
    declarations: [
        CreateNewSuggestionPage,
    ],
    imports: [
        IonicModule,
        ComponentsModule,
        IonicPageModule.forChild(CreateNewSuggestionPage),
    ],
})
export class CreateNewSuggestionModule {}
