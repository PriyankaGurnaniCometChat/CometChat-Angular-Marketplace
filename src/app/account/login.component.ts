import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ModalService } from "../_modal";
import { CometChat } from "@cometchat-pro/chat";
import { COMETCHAT_CONSTANTS } from "../../CONSTS";
import { AuthService, User } from "./auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  defaultUserUrls: {};
  loginModalId: string;
  userAvatar: string;

  constructor(private modalService: ModalService, public auth: AuthService) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.userAvatar = this.auth.getUser()?.userAvatar;
    }
    this.loginModalId = "login-modal";
    this.defaultUserUrls = COMETCHAT_CONSTANTS.imgUrls;
  }

  openModal() {
    if (this.auth.isLoggedIn()) {
      CometChat.logout().then(
        (_) => {
          console.log("Logout completed successfully");
        },
        (error) => {
          console.log(`Logout failed with exception: ${error}`);
        }
      );

      this.auth.logout();
    } else {
      this.modalService.open(this.loginModalId);
    }
  }

  closeModal(f: NgForm = undefined) {
    if (f) {
      f.reset();
    }
    this.modalService.close(this.loginModalId);
  }

  onSelectUser(f: NgForm, user: string) {
    f.setValue({ username: user });
    this.onSignIn(f);
  }

  onSignIn(f: NgForm) {
    f.control.markAllAsTouched();

    const username = f.value.username;
    const name =
      username in COMETCHAT_CONSTANTS.UIDs
        ? COMETCHAT_CONSTANTS.UIDs[username]
        : username;
    CometChat.login(name, COMETCHAT_CONSTANTS.AUTH_KEY).then(
      (user) => {
        console.log("Login Successful:", { user });
        const userData: User = {
          name: username,
          isLoggedIn: true,
          userAvatar: user.getAvatar(),
        };
        this.auth.setUser(userData);
        this.userAvatar = userData.userAvatar;
        this.closeModal(f);
      },
      (error) => {
        console.log("Login failed with exception:", { error });
        if (username in COMETCHAT_CONSTANTS.UIDs) {
          f.control.setErrors({
            signInErrorMsg: `Login failed: Check your CometChat App ID & Auth Key in src/CONSTS.ts`,
          });
        } else {
          f.control.setErrors({
            signInErrorMsg: `User '${username}' is not one of the default users. To use a default user without registering, please select an avatar. `,
          });
        }
      }
    );
  }

  onRegister(f: NgForm) {
    f.control.markAllAsTouched();

    const username = f.value.registerUsername;
    const displayname = f.value.displayname;
    if (username && displayname) {
      const cometChatUser = new CometChat.User(username);
      cometChatUser.setName(displayname);
      CometChat.createUser(cometChatUser, COMETCHAT_CONSTANTS.AUTH_KEY).then(
        (user) => {
          console.log("User created", user);
          this.closeModal(f);
        },
        (error) => {
          f.control.setErrors({
            registerErrorMsg: `User registration failed: Check your CometChat App ID & Auth Key in src/CONSTS.ts`,
          });
          console.log("User registration error", error);
        }
      );
    }
  }
}
