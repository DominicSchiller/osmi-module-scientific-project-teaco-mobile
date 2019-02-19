import { NgModule } from '@angular/core';
import {LoginPage} from "./login";
import {ComponentsModule} from "../../../components/components.module";
import {IonicPageModule} from "ionic-angular";

@NgModule({
    declarations: [
        LoginPage,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(LoginPage),
    ],
})
export class LoginModule {}
