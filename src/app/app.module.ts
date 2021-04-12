import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { CometChatUI } from "../cometchat-pro-angular-ui-kit/CometChatWorkspace/projects/angular-chat-ui-kit/src/components/CometChatUI/CometChat-Ui/cometchat-ui.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HomeModule, CometChatUI],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
