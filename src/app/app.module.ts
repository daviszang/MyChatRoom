import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { ElModule } from "element-angular";

import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { AdminComponent } from "./admin/admin.component";
import { ChooseGroupAndChannelComponent } from "./choose-group-and-channel/choose-group-and-channel.component";
import { TestComponent } from "./test/test.component";
import { ChatComponentComponent } from "./chat/chat-component/chat-component.component";
import { EditChannelComponent } from "./edit-channel/edit-channel.component";
import { AddRemoveUserComponent } from "./add-remove-user/add-remove-user.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "admin", component: AdminComponent },
  { path: "chatroom", component: ChatComponentComponent },
  { path: "chooseGroupAndChannel", component: ChooseGroupAndChannelComponent },
  { path: "editchannel/:id", component: EditChannelComponent },
  { path: "editchanneluser/:id", component: AddRemoveUserComponent },
  { path: "**", redirectTo: "login" }
  // path: 'book-details/:id',
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    ChooseGroupAndChannelComponent,
    TestComponent,
    ChatComponentComponent,
    EditChannelComponent,
    AddRemoveUserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ElModule.forRoot(),
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
