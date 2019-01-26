import { NgModule } from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {AddNewSuggestionPage} from "./add-new-suggestion";
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
    declarations: [
        AddNewSuggestionPage,
    ],
    imports: [
        IonicModule,
        ComponentsModule,
        IonicPageModule.forChild(AddNewSuggestionPage),
    ],
})
export class AddNewSuggestionModule {}
