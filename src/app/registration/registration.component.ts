import { Component, OnInit } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

// class Registration {
//   constructor(
//     public firstName: string = "",
//     public lastName: string = "",
//     public dob: NgbDateStruct = null,
//     public email: string = "",
//     public password: string = "",
//     public country: string = "Select country"
//   ) {}
// }

class ReturnAuth {
  constructor(
    public userid: string = "",
    public username: string = "",
    public password: string = "",
    public phonenumber: string = "",
    public idmerchan: string = ""
  ){}
}

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"]
})
export class RegistrationComponent implements OnInit {
  // It maintains list of Registrations
  // registrations: Array<any> = [];
  login: Array<any> = [];
  // It maintains registration Model
  regModel: ReturnAuth ;
  // It maintains registration form display status. By default it will be false.
  showNew: Boolean = false;
  // It will be either 'Save' or 'Update' based on operation.
  submitType: string = "Save";
  // It maintains table row index based on selection.
  selectedRow: number;
  // It maintains Array of countries.
  // countries: string[] = ["US", "sUK", "India", "UAE"];

  // registrationList: Array<any> = []; // List of Users
  loginList: Array<any> = [];
  comments: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    // this.displayRegistrations();
    this.displayReturnAuth();
  }

  // Get all registrations
  displayReturnAuth() {
    // const getRegistrations = gql`
      const getReturnAuths = gql`
      {
        ReturnAuths {
          id
          token
        }
      }
    `;

    this.apollo
      .watchQuery({
        query: getReturnAuths,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.Registrations)
      .subscribe(data => {
        this.login = data;
      });
  }

  // This method associate to New Button.
  onNew() {
    // Initiate new registration.
    this.regModel = new ReturnAuth();
    // Change submitType to 'Save'.
    this.submitType = "Save";
    // display registration entry section.
    this.showNew = true;
  }

  // This method associate to Save Button.
  onSave() {
    // var dateVal =
    //   this.regModel.dob.year.toString() +
    //   "-" +
    //   this.regModel.dob.month.toString() +
    //   "-" +
    //   this.regModel.dob.day.toString();
    if (this.submitType === "Save") {
      // const saveRegistration = gql`
      const saveLogin = gql`
        mutation createLogin(
          $userid: String!
          $username: String!
          $password: String!
          $phonenumber: String!
          $idmerchan: String!
        ) {
          createLogin(
            iduser: $userid
            username: $username
            password: $password
            phonenumber: $phonenumber
            idmerchan: $idmerchan
          ) {
            id
            token
          }
        }
      `;
      this.apollo
        .mutate({
          mutation: saveLogin,
          variables: {
            iduser: this.regModel.userid,
            username: this.regModel.username,
            password: this.regModel.password,
            phonenumber: this.regModel.phonenumber,
            idmerchan: this.regModel.idmerchan,
          }
        })
        .subscribe(
          ({ data }) => {
            
            this.displayReturnAuth();
          },
          error => {
            console.log("there was an error sending the query", error);
          }
        );

      // Push registration model object into registration list.
      // this.registrations.push(this.regModel);
    } else {
      const updateLogin = gql`
        mutation updateLogin(
          $iduser: String!
          $username: String!
          $password: String!
          $phonenumber: String!
          $idmerchan: String!
        ) {
          updateLogin(
            iduser: $iduser 
            username: $username
            password: $password
            phonenumber: $phonenumber
            idmerchan: $idmerchan
          ) {
            id
            token
          }
        }
      `;
      this.apollo
        .mutate({
          mutation: updateLogin,
          variables: {
            iduser: this.selectedRow + 1,
            username: this.regModel.username,
            password: this.regModel.password,
            phonenumber: this.regModel.phonenumber,
            idmerchan: this.regModel.idmerchan
          }
        })
        .subscribe(
          ({ data }) => {
            console.log("got edit data", data);
            this.displayReturnAuth();
          },
          error => {
            console.log("there was an error sending the query", error);
          }
        );
    }
    // Hide registration entry section.
    this.showNew = false;
  }

  // This method associate to Edit Button.
  onEdit(index: number) {
    // Assign selected table row index.
    this.selectedRow = index;
    // Initiate new registration.
    this.regModel = new ReturnAuth();
    // Retrieve selected registration from list and assign to model.
    this.regModel = Object.assign({}, this.login[this.selectedRow]);
    const dob = new Date(this.login[this.selectedRow].dob);

    // this.regModel.dob = {
    //   day: dob.getDate(),
    //   month: dob.getMonth() + 1,
    //   year: dob.getFullYear()
    // };

    // Change submitType to Update.
    this.submitType = "Update";
    // Display registration entry section.
    this.showNew = true;
  }

  // This method associate to Delete Button.
  onDelete(index: number) {
    const deleteRegistration = gql`
      mutation deleteRegistration($id: ID!) {
        deleteRegistration(id: $id) {
          id
        }
      }
    `;
    this.apollo
      .mutate({
        mutation: deleteRegistration,
        variables: {
          id: index + 1
        }
      })
      .subscribe(
        ({ data }) => {
          console.log("got editdata", data);
          this.displayReturnAuth();
        },
        error => {
          console.log("there was an error sending the query delete", error);
        }
      );
  }

  // This method associate toCancel Button.
  onCancel() {
    // Hide registration entry section.
    this.showNew = false;
  }

  // This method associate to Bootstrap dropdown selection change.
  // onChangeCountry(country: string) {
  //   // Assign corresponding selected country to model.
  //   this.regModel.country = country;
  // }
}
