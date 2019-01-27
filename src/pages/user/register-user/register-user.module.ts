import { NgModule } from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {RegisterUserPage} from "./register-user";
import {ComponentsModule} from "../../../components/components.module";
import {AppModule} from "../../../app/app.module";
import {MyApp} from "../../../app/app.component";
import {BrowserModule} from "@angular/platform-browser";
import {LoadingIndicatorComponent} from "../../../components/loading-indicator/loading-indicator";

@NgModule({
    declarations: [
        RegisterUserPage,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(RegisterUserPage),
    ],
})
export class RegisterUserModule {}
