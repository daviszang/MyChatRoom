import { Component, OnInit } from "@angular/core";
import { DbService } from "../db/db.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-add-remove-user",
  templateUrl: "./add-remove-user.component.html",
  styleUrls: ["./add-remove-user.component.css"]
})
export class AddRemoveUserComponent implements OnInit {
  public users;
  public channel;
  public channelId;

  inChannel(userId){
    // console.log(this.channel);
    for(let i = 0;i<this.channel.members.length;i++){
      if(userId == this.channel.members[i]){
        return true;
      }
    }
    return false;
  }

  notinChannel(userId){
    return !this.inChannel(userId);
  }

  addUserToChannel(channelId, userId) {
    this.dbService.addUserChannel(channelId, userId).subscribe(data => {
      this.getUsers();
      this.getChannel(channelId);
    });
  }

  deleteUserFromChannel(channelId, userId) {
    this.dbService.deleteUserFromChannel(channelId, userId).subscribe(data => {
      this.getUsers();
      this.getChannel(channelId);
    });
  }

  getUsers() {
    return this.dbService.getUsers().subscribe(
      users => {
        this.users = users;
      },
      err => console.log(err)
    );
  }

  constructor(private route: ActivatedRoute, private dbService: DbService) {}

  getChannel(channelId) {
    this.dbService.getChannel(channelId).subscribe(data => {
      this.channel = data.channel;
    });
  }

  ngOnInit() {
    this.channelId = this.route.snapshot.params["id"];
    this.getChannel(this.channelId);
    this.getUsers();
    // this.getChannelUsers(this.channelId);
    console.log("init");
    console.log(this.users);
  }
}
