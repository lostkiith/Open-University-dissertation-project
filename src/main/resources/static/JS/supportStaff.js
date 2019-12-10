//functions relating to submitting a client meeting.
/**
 *  populates the form with a list of supported clients and when selected with appointments.
 *  parameters from the form are used to create a appointment meeting.
 */
function openClientMeetingForm() {

    document.getElementById("ClientMeetingForm").style.display = "block";

    //populate list of clients.
    populateClientList("clientAtMeeting");

}

function onSelectAppointment() {

    let select = document.getElementById("clientAtMeeting");
    let opt = select.options[select.selectedIndex];
    let clientID = JSON.parse(opt.value);

    let option;
    select = document.getElementById("clientAppointment");
    let i;
    for (i = select.options.length - 1; i >= 0; i--) {
        select.remove(i);
    }

    $.get("http://localhost:8080/Charity/getAppointments/",
        function (data) {
            let dayWord = "";
            for (let i = 0; i < data.length; i++) {
                switch (data[i].day) {
                    case 0:
                        dayWord = "SUNDAY";
                        break;
                    case 1:
                        dayWord = "MONDAY";
                        break;
                    case 2:
                        dayWord = "TUESDAY";
                        break;
                    case 3:
                        dayWord = "WEDNESDAY";
                        break;
                    case 4:
                        dayWord = "THURSDAY";
                        break;
                    case 5:
                        dayWord = "FRIDAY";
                        break;
                    case 6:
                        dayWord = "SATURDAY";
                }
                if (clientID.nationalHealthServiceNumber === data[i].client.nationalHealthServiceNumber) {
                    option = document.createElement('option');
                    option.value = JSON.stringify(data[i]);
                    option.text = dayWord + " with " + data[i].client.firstName + " starting at " +
                        data[i].startTime + " Finishing at " + data[i].endTime;
                    select.add(option);
                }
            }
            select.hidden = false;
        }
    ).fail(function (data) {
        alert(data.message);
    });

}

function controlInput() {

    if (document.getElementById("cancelled").checked === true) {
        document.getElementById("timeStarted").disabled = true;
        document.getElementById("timeFinished").disabled = true;
        document.getElementById("Location").disabled = true;
        document.getElementById("clientSignature").disabled = true;
        document.getElementById("labelNotes").innerHTML = "Reason".bold();
    } else {
        document.getElementById("timeStarted").disabled = false;
        document.getElementById("timeFinished").disabled = false;
        document.getElementById("Location").disabled = false;
        document.getElementById("clientSignature").disabled = false;
        document.getElementById("labelNotes").innerHTML = "Notes".bold();
    }
}

/**
 * submit the meeting the the database.
 */
function submitMeetingForm() {
    let select = document.getElementById("clientAppointment");
    let opt = select.options[select.selectedIndex];
    let clientAppointment = JSON.parse(opt.value);
    let day = clientAppointment.day;
    let appStartTime = clientAppointment.startTime;
    let appEndTime = clientAppointment.endTime;
    let appStarted = document.getElementById("timeStarted").value;
    let appEnded = document.getElementById("timeFinished").value;
    let location = document.getElementById("Location").value;
    let notes = document.getElementById("notes").value;
    let date = document.getElementById("Date").value;
    let clientSignature = document.getElementById("clientSignature").value;

    // day number to word
    switch (day) {
        case 0:
            day = "SUNDAY";
            break;
        case 1:
            day = "MONDAY";
            break;
        case 2:
            day = "TUESDAY";
            break;
        case 3:
            day = "WEDNESDAY";
            break;
        case 4:
            day = "THURSDAY";
            break;
        case 5:
            day = "FRIDAY";
            break;
        case 6:
            day = "SATURDAY";
    }

    if (document.getElementById("cancelled").checked === false) {
        $.post(
            "http://localhost:8080/Charity/createAppMeeting/",
            {
                day: day,
                appStartTime: appStartTime,
                appEndTime: appEndTime,
                appStarted: appStarted,
                appEnded: appEnded,
                location: location,
                notes: notes,
                date: date,
                clientSignature: clientSignature,
                cancelled: document.getElementById("cancelled").checked
            },
            function (data) {
                document.getElementById("informMeeting").innerText = "Successfully registered the appointment meeting.";
            }).fail(function (data) {
            document.getElementById("informMeeting").innerText = data.responseJSON.message;
        });
    } else {
        $.post(
            "http://localhost:8080/Charity/createAppMeeting/",
            {
                day: day,
                appStartTime: appStartTime,
                appEndTime: appEndTime,
                appStarted: appStartTime,
                appEnded: appEndTime,
                location: "N/A",
                notes: notes,
                date: date,
                clientSignature: clientSignature,
                cancelled: document.getElementById("cancelled").checked
            },
            function () {
                document.getElementById("informMeeting").innerText = "Successfully registered the appointment meeting.";
            }).fail(function (data) {
            document.getElementById("informMeeting").innerText = data.responseJSON.message;
        });
    }
}

function closeClientMeetingForm() {
    document.getElementById("ClientMeetingForm").style.display = "none";
    let select = document.getElementById("clientAtMeeting");
    let i;
    for (i = select.options.length - 1; i >= 1; i--) {
        select.remove(i);
    }
    select = document.getElementById("clientAppointment");
    for (i = select.options.length - 1; i >= 0; i--) {
        select.remove(i);
    }
    select.hidden = true;
    $("#ClientMeetingForm *").val("");
    document.getElementById("cancelled").checked = false;
    window.location.href = window.location.href
}

//functions relating to displaying the clients details.
function openListOfClientsForm() {
    document.getElementById("listOfClients").style.display = "block";

    //populate list of clients.
    populateClientList("clients");
}

function onClientSelect() {
    let select = document.getElementById("clients");
    let opt = select.options[select.selectedIndex];
    let clientID = JSON.parse(opt.value);

    document.getElementById("firstName").innerText = "First Name : " + clientID.firstName;
    document.getElementById("lastName").innerText = "Last Name : " + clientID.lastName;
    document.getElementById("username").innerText = "Username : " + clientID.username;
    document.getElementById("sex").innerText = "Sex : " + clientID.sex;
    document.getElementById("dateOfBirth").innerText = "date Of Birth : " + clientID.dateOfBirth;
    document.getElementById("generalCondition").innerText = "general Condition : " + clientID.generalCondition;
    document.getElementById("nextOfKin").innerText = "Next Of kin : " + clientID.nextOfKin;
    document.getElementById("nextOfKinNumber").innerText = "Next of kin contact Number : " + clientID.nextOfKinNumber;
    document.getElementById("Diagnosis").innerText = "Diagnosis : " + clientID.diagnosis;
    document.getElementById("nationalHealthServiceNumber").innerText = "National Health Service Number : " + clientID.nationalHealthServiceNumber;
    document.getElementById("currentSupportedHouse").innerText = "Current Supported House : " + clientID.currentSupportedHouseObject.houseName;

}

function closeListOfClientsForm() {

    document.getElementById("listOfClients").style.display = "none";

    let select = document.getElementById("clients");
    let i;
    for (i = select.options.length - 1; i >= 1; i--) {
        select.remove(i);
    }


    document.getElementById("firstName").innerText = "First Name : ";
    document.getElementById("lastName").innerText = "Last Name : ";
    document.getElementById("username").innerText = "Username : ";
    document.getElementById("sex").innerText = "Sex : ";
    document.getElementById("dateOfBirth").innerText = "date Of Birth : ";
    document.getElementById("generalCondition").innerText = "general Condition : ";
    document.getElementById("nextOfKin").innerText = "Next Of kin : ";
    document.getElementById("nextOfKinNumber").innerText = "Next of kin contact Number : ";
    document.getElementById("Diagnosis").innerText = "Diagnosis : ";
    document.getElementById("nationalHealthServiceNumber").innerText = "National Health Service Number : ";
    document.getElementById("currentSupportedHouse").innerText = "Current Supported House : ";

}

//functions relating to messages.
function openClientMessage() {
    //populate list of clients.
    populateClientList("messageClient");
}

function closeClientMessage() {

    let select = document.getElementById("messageClient");
    let i;
    for (i = select.options.length - 1; i >= 1; i--) {
        select.remove(i);
    }
}

function submitClientMessage() {
    let select = document.getElementById("messageClient");
    let opt = select.options[select.selectedIndex];
    let client = JSON.parse(opt.value);

    $.post(
        "http://localhost:8080/Client/createNote/",
        {
            nationalHealthServiceNumber: client.nationalHealthServiceNumber,
            note: document.getElementById("messageBody").value,
            priority: $("input[name='priorityRadio']:checked").val()
        },
        function (data) {
            alert("message sent");
        }).fail(function (data) {
        alert(data.message);
    });
}

function loadNotes(firstName, lastName) {
    removeSelectItems("clientsMessages");
    populateClientList("clientsMessages");
    let sel = document.getElementById("clientsMessages");
    let option = document.createElement('option');
    option.text = "all Messages";
    sel.add(option);
    $('#newMessages').empty();
    $('#readMessages').empty();

    let para, node, priority;
    $.get("http://localhost:8080/Charity/getSupportWorkersClients/",
        function (data) {
            for (let i = 0; i < data.length; i++) {
                // NULL ONLY FOR TESTING REPLACE WITH LENGTH.
                if (typeof data[i].notes !== 'undefined' && data[i].notes !== null && data[i].notes.length > 0) {
                    if (typeof firstName !== 'undefined') {
                        for (let k = 0; k < data[i].notes.length; k++) {
                            //checks if the returned object contains the names passed are parameters
                            if (firstName === data[i].firstName && lastName === data[i].lastName) {
                                switch (data[i].notes[k].priority) {
                                    case 1:
                                        priority = "Critical";
                                        break;
                                    case 2:
                                        priority = "High";
                                        break;
                                    case 3:
                                        priority = "Low";
                                        break;
                                }
                                para = document.createElement("li");
                                if (data[i].notes[k].hasBeenReadBy.includes(userID)) {
                                    para.className = "list-group-item list-group-item-dark";
                                } else {
                                    para.className = "list-group-item";
                                }
                                para.onclick = function () {
                                    $("#MessageHead").text("Note about " + data[i].firstName + " " + data[i].lastName + " on " + new Date(data[i].notes[k].created));
                                    $("#theMessage").text(data[i].notes[k].note);
                                    $("#messagesModal").modal();

                                    //UPDATE THE ID WITH THIS MESSAGE BEING READ.
                                    $.post("http://localhost:8080/Client/noteHasBeenReadBy/",
                                        {
                                            nationalHealthServiceNumber: data[i].nationalHealthServiceNumber,
                                            note: data[i].notes[k].note
                                        },
                                    ).fail(function (data) {
                                        alert(data.message);
                                    });
                                };
                                node = document.createTextNode("Note about " + data[i].firstName + " " + data[i].lastName +
                                    " Priority of " + priority + ", received on " + new Date(data[i].notes[k].created));
                                para.appendChild(node);
                                if (para.className === "list-group-item") {
                                    document.getElementById("newMessages").appendChild(para);
                                } else {
                                    document.getElementById("readMessages").appendChild(para);
                                }
                            }
                        }
                    } else {
                        for (let k = 0; k < data[i].notes.length; k++) {
                            switch (data[i].notes[k].priority) {
                                case 1:
                                    priority = "Critical";
                                    break;
                                case 2:
                                    priority = "High";
                                    break;
                                case 3:
                                    priority = "Low";
                                    break;
                            }
                            para = document.createElement("li");
                            if (data[i].notes[k].hasBeenReadBy.includes(userID)) {
                                para.className = "list-group-item list-group-item-dark";
                            } else {
                                para.className = "list-group-item";
                            }

                            para.onclick = function () {
                                $("#MessageHead").text("Note about " + data[i].firstName + " " + data[i].lastName + " on " + new Date(data[i].notes[k].created));
                                $("#theMessage").text(data[i].notes[k].note);
                                $("#messagesModal").modal();
                                //UPDATE THE ID WITH THIS MESSAGE BEING READ.
                                $.post("http://localhost:8080/Client/noteHasBeenReadBy/",
                                    {
                                        nationalHealthServiceNumber: data[i].nationalHealthServiceNumber,
                                        note: data[i].notes[k].note
                                    },
                                ).fail(function (data) {
                                    alert(data.message);
                                });
                            };
                            node = document.createTextNode("Note about " + data[i].firstName + " " + data[i].lastName +
                                " Priority of " + priority + ", received on " + new Date(data[i].notes[k].created));
                            para.appendChild(node);
                            if (para.className === "list-group-item") {
                                document.getElementById("newMessages").appendChild(para);
                            } else {
                                document.getElementById("readMessages").appendChild(para);
                            }
                        }
                    }
                }
            }
        }
    ).fail(function (data) {
            alert(data.message);
        }
    ).always(function () {
        sortListPriority("newMessages");
        sortListPriority("readMessages");
    });
}

function loadClientNotes() {
    let select = document.getElementById("clientsMessages");
    let opt = select.options[select.selectedIndex];
    if (opt.text === "all Messages") {
        loadNotes();
    } else {
        let clientID = JSON.parse(opt.value);
        loadNotes(clientID.firstName, clientID.lastName);
    }
}

function behavioralSignsMissedAppOneSup() {

    $.get("http://localhost:8080/Charity/behavioralSignsMissedAppOneSup/",
        function (data) {
            for (let i = 0; i < data.length; i++) {
                document.getElementById("informSupport").innerText = document.getElementById("informSupport").innerText + " " + "The Client: " + data[i].client.firstName + " " + data[i].client.lastName +
                    " has missed their last three appointments with Staff Member: " + data[i].staffMember.firstName + " " + data[i].staffMember.lastName +
                    "\n"
            }

        }
    ).fail(function (data) {
        document.getElementById("supportStaffInfo").innerText = data.responseJSON.message;
    });

}

function behavioralSignsMissedAppAll() {

    $.get("http://localhost:8080/Charity/behavioralSignsMissedAppAll/",
        function (data) {
            if (data.length !== 0) {
                for (let i = 0; i < data.length; i++) {
                    document.getElementById("informSupport").innerText = document.getElementById("informSupport").innerText + " " + "The Client: " + data[i].firstName + " " + data[i].lastName +
                        " has missed their last three appointments" + "\n";
                }
            }
        }
    ).fail(function (data) {
        document.getElementById("supportStaffInfo").innerText = data.responseJSON.message;
    });

}