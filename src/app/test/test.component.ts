import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl
} from "@angular/forms";

type validateResult = {
  status: string;
  message?: string;
};

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.css"]
})
export class TestComponent implements OnInit {
  private socket;
  constructor() {
  }

  ngOnInit() {}
}
