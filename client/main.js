import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Mongo } from 'meteor/mongo';

import './main.html';

roomNum = "0";

if (Meteor.isClient) {
    Tracker.autorun(function () {
        //Collection subscription. Allowing data to go to the CLient
        Meteor.subscribe("allUsers");
        Meteor.subscribe("allUserData");
    });
    //Sign-up Method
    Template.signup.events({
        'submit form': function (event) {
            event.preventDefault();
            var emailVar = event.target.signupEmail.value;
            var passwordVar = event.target.signupPassword.value;
            date = new Date();
            nameVar = event.target.signupName.value;
            //Uses input data as arguments for base account creation.
            if (nameVar == "Paul") {
                Accounts.createUser({
                    email: emailVar,
                    password: passwordVar,
                    profile: {
                        name: nameVar,
                        role: "Admin",
                        createdAt: date,
                        room_type: "",
                        room_number: "",
                        person_number: "",
                        child_number: "",
                        inDate: "",
                        outDate: "",
                        checked_In: false
                    }
                });
            } else {
                Accounts.createUser({
                    email: emailVar,
                    password: passwordVar,
                    profile: {
                        name: nameVar,
                        role: "User",
                        createdAt: date,
                        room_type: "",
                        room_number: roomNum,
                        person_number: "",
                        child_number: "",
                        inDate: "",
                        outDate: "",
                        checked_In: false
                    }
                });
            }
        }
    });
    //Hook for cancel button erasing room reservation, but not the account itself
    Template.body.events({
        'click .cancel': function (e) {
            event.preventDefault();
            var date = Meteor.user().profile.createdAt;
            var name = Meteor.user().profile.name;
            var role = Meteor.user().profile.role;
            Meteor.users.update({ _id: Meteor.userId() }, {
                "$set": {
                    "profile": {
                        "room_type": "0",
                        "room_number": "0",
                        "person_number": "0",
                        "child_number": "0",
                        "createdAt": date,
                        "checked_In": false,
                        "name": name,
                        "role": role
                    }
                }
            });
            //alert("Great Success!");
            //Currently open Modals must be closed or the new one opening doed weird stuff to the screen region/website proportions.
            $('#myModalAccount').modal('hide');
            $('#myModalAdmin').modal('hide');
            setTimeout(function () {
                $('#myModal2').modal('show');
            }, 1000)
        }
    });
    //Login button hook
    Template.login.events({
        'submit form': function (event) {
            event.preventDefault();
            var emailVar = event.target.loginEmail.value;
            var passwordVar = event.target.loginPassword.value;
            Meteor.loginWithPassword(emailVar, passwordVar, function (err) {
                if (err) {
                    $('#myModal3').modal('show');
                } else {
                    $('#myModal4').modal('show');
                }
            });
        }
    });
    //Logout button hook
    Template.settings.events({
        'click .logout': function (event) {
            event.preventDefault();
            Meteor.logout();
        },
        //Room Reservation helper
        'submit form': function (event) {
            event.preventDefault();
            var room_type = event.target.room_type.value;
            var room_number = event.target.room_number.value;
            var person_number = event.target.person_number.value;
            var child_number = event.target.child_number.value;
            var date = Meteor.user().profile.createdAt;
            var name = Meteor.user().profile.name;
            var role = Meteor.user().profile.role;
            inDate = event.target.inDate.value;
            outDate = event.target.outDate.value;
            Meteor.users.update({ _id: Meteor.userId() }, {
                "$set": {
                    "profile": {
                        "room_type": room_type,
                        "room_number": room_number,
                        "person_number": person_number,
                        "child_number": child_number,
                        "createdAt": date,
                        "checked_In": false,
                        "name": name,
                        "inDate": inDate,
                        "outDate": outDate,
                        "role": role
                    }
                }
            });
            //alert("Great Success!");
            $('#myModal').modal('show');
            event.target.room_type.value = "Select Room/Suite";
            event.target.room_number.value = "0";
            event.target.person_number.value = "0";
            event.target.child_number.value = "0";
        }
    });

    //datePicker1 and 2 are helper functions for the calendars in the reservation dropdown.
    Template.datePicker1.onRendered(function () {
        this.$('.datetimepicker1').datetimepicker({
            format: 'dddd, MMMM Do YYYY'
        });
    });
    Template.datePicker2.onRendered(function () {
        this.$('.datetimepicker2').datetimepicker({
            format: 'dddd, MMMM Do YYYY'
        });
    });

    //Many helper functions for passing global variables to the HTML templates.
    Template.userEmail.helpers({
        userEmail: function () {
            return Meteor.user().emails[0].address
        }
    });
    Template.userInDate.helpers({
        userInDate: function () {
            return Meteor.user().profile.inDate
        }
    });
    Template.userOutDate.helpers({
        userOutDate: function () {
            return Meteor.user().profile.outDate
        }
    });
    Template.userName.helpers({
        userName: function () {
            return Meteor.user().profile.name
        }
    });
    Template.userChecked_In.helpers({
        userChecked_In: function () {
            return Meteor.user().profile.checked_In
        }
    });
    Template.userRole.helpers({
        userRole: function () {
            return Meteor.user().profile.role
        }
    });
    Template.userChildNumber.helpers({
        userChildNumber: function () {
            return Meteor.user().profile.child_number
        }
    });
    Template.userEmailVerified.helpers({
        userEmailVerified: function () {
            return Meteor.user().emails[0].verified
        }
    });
    Template.userPersonNumber.helpers({
        userPersonNumber: function () {
            return Meteor.user().profile.person_number
        }
    });
    Template.userCreatedAt.helpers({
        userCreatedAt: function () {
            return Meteor.user().profile.createdAt
        }
    });
    Template.userNumRoom.helpers({
        userNumRoom: function () {
            return Meteor.user().profile.room_number
        }
    });
    Template.userRoomType.helpers({
        userRoomType: function () {
            return Meteor.user().profile.room_type
        }
    });
    Template.daysOverview.helpers({
        users() {
            return Meteor.users.find({});
        },
        email() {
            return this.emails[0].address;
        }
    });
    /*  REQUIRES AUTHORIZATION. POSSIBLE TO PUBLISH?
        userID: function () {
          return Meteor.user()._id
        }, */
    Template.isAdmin.helpers({
        admin: function () {
            if (Meteor.user().profile.role == "Admin") {
                return true
            } else {
                return false
            }
        }
    });
    /*a = Meteor.users.find()
    names = a.map((function (a) {
        return a.names;
    }));
    if (!names.isArray) {
        alert(names[0])
    }
    Template.userDB.helpers({
        userD: function () {
            return names
        }
    }) */
}

if (Meteor.isServer) {
    Meteor.startup(function () {
    });
    //These three publish functions are just for allowing collection data to go to the client that subscribes to them.
    Meteor.publish('allUsers', function () {
        return Meteor.users.find({});
    });
    Meteor.publish('AllUserData', function () {
        return Meteor.users.find({}, { fields: { emails: 1, profile: 1 } });
    });
    Meteor.publish('profiles', function () { Meteor.users.find({}) });

}