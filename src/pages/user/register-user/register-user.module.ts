import { NgModule } from '@angular/core';
import {RegisterUserPage} from "./register-user";
import {ComponentsModule} from "../../../components/components.module";
import {IonicPageModule} from "ionic-angular";

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
