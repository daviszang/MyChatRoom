import { Component, OnInit } from "@angular/core";
import { DbService } from "../db/db.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-edit-channel",
  templateUrl: "./edit-channel.component.html",
  styleUrls: ["./edit-channel.component.css"]
})
export class EditChannelComponent implements OnInit {
  public group;
  public channels;
  public groupId;
  public edittingChannel;
  public eddittingChannelID;

  public users;
  // public tableData: any[] = [];
  constructor(private route: ActivatedRoute, private dbService: DbService) {}

  getGroupById(groupId) {
    this.dbService.getGroupById(groupId).subscribe(
      data => {
        this.group = data.group;
        // console.log(this.group);
      }
    );
  }

  getChannels(groupId){
    this.dbService.getChannels(groupId).subscribe(
      data => {
        this.channels = data;
      }
    )
  }


  deleteChannel(channelId){
    this.dbService.deleteChannel(channelId).subscribe(
      data=>{
        this.getChannels(this.groupId)
      }
    )
  }



  ngOnInit() {
    this.groupId = this.route.snapshot.params["id"];
    this.getGroupById(this.groupId);
    this.getChannels(this.groupId);
    console.log(this.group);
  }
}
