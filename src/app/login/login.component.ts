import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DbService } from "../db/db.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  public username;
  public password;

  constructor(
    private activedRoute: ActivatedRoute,
    private dbService: DbService
  ) {}

  login() {
    return this.dbService.login(this.username, this.password).subscribe(
      data => {
        if (data.message == "Auth successful") {
          localStorage.setItem("username", data.userInfo.username);
          localStorage.setItem("type", data.userInfo.type);
          localStorage.setItem("userId", data.userInfo.userId);
          if (data.userInfo.type === 0) {
            location.replace("./chooseGroupAndChannel");
          } else {
            location.replace("./admin");
          }
          console.log("login success");
        } else {
          location.reload();
        }
      },
      err => console.log(err)
    );

    // return this.dbService.getUser(this.username, this.password).then(result => {
    //   if (result["contain"] == true) {
    //     localStorage.setItem("username", this.username);
    //     localStorage.setItem("type",result["user"].type);
    //     let user = result["user"];
    //     //general
    //     if (user.type === 0) {
    //       location.replace("./chooseGroupAndChannel");
    //     }else{
    //       location.replace("./admin");
    //     }
    //     console.log("login success")
    //   } else {
    //     location.reload();
    //     // console.log("login fail")
    //   }
    // });
  }

  ngOnInit() {
    let username = localStorage.getItem("username");
    if (username != undefined) {
      let type = localStorage.getItem("type");
      if (type == "0") {
        location.replace("./chooseGroupAndChannel");
      } else {
        location.replace("./admin");
      }
    }
  }
}
