import { Component } from "@angular/core";
import { DbService } from "./db/db.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [DbService]
})
export class AppComponent {
  title = "ChatRoom";
  singout() {
    this.dbService.logout().subscribe(() => {}, err => console.log(err));
    localStorage.removeItem("username");
    localStorage.removeItem("type");
    localStorage.removeItem("userId");
    localStorage.removeItem("groupId");
    localStorage.removeItem("channelId");
  }

  constructor(private dbService: DbService) {}
}
