let GCalendar;
let userRole;
let userID;
let managerCalender;

//setting up the calendar.
/**
 * load the calendar if the user is not a manager.
 * @param userRole  the role of the user that is loaded in.
 */
function loadCalendar(userRole) {
    if (userRole !== "ROLE_MANAGER") {
        if (userRole === "ROLE_STAFF") {
            document.getElementById("controller").hidden = true;
            let btnMeeting = document.createElement('BUTTON');
            btnMeeting.innerHTML = "Submit Client Meeting";
            btnMeeting.onclick = function () {
                openClientMeetingForm()
            };
            btnMeeting.setAttribute("class", "open-button btn btn-info");
            document.getElementById('ClientMeetingFormButton').appendChild(btnMeeting);

            let btnList = document.createElement('BUTTON');
            btnList.innerHTML = "List of clients";
            btnList.onclick = function () {
                openListOfClientsForm()
            };
            btnList.setAttribute("class", "open-button btn btn-info");
            document.getElementById('listOfClientsButton').appendChild(btnList);
        }
        if (userRole === "ROLE_CLIENT") {
            $("#messaageSystem *").prop('disabled', true).prop('hidden', true);
            document.getElementById("controller").hidden = true;
        }
        let calendarEl = document.getElementById('calendar');
        let calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: ['timeGrid', 'dayGrid', 'bootstrap'],
            header: {right: 'dayGridMonth,timeGridWeek,today prev,next'},
            minTime: '06:00:00',
            maxTime: '20:00:00',
            themeSystem: 'bootstrap',
            height: 650,

            eventRender: function (info) {
                if (userRole === "ROLE_STAFF") {
                    if (typeof info.event.extendedProps.description !== 'undefined') {
                        $(info.el).popover(
                            {
                                title: info.event.title,
                                content: info.event.extendedProps.description,
                                placement: 'auto',
                                trigger: 'click',
                                container: 'body',
                                animation: true
                            });
                    }
                }
            }

        });
        calendar.render();
        GCalendar = calendar;
        updateCalendar();
    }
}

/**
 * update the calendar with the appointments of the logged in user.
 */
function updateCalendar() {
    let color;
    $.get(
        "http://localhost:8080/Charity/getAppointments/",
        function (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].appointmentMeetings.length > 0) {
                    for (let k = 0; k < data[i].appointmentMeetings.length; k++) {
                        if (userRole === "ROLE_STAFF") {
                            color = data[i].appointmentMeetings[k].cancelled === true ? "red" : "green";
                            GCalendar.addEvent(
                                { // adds the events for a Staff member so, client names.
                                    title: data[i].client.firstName + " " + data[i].client.lastName,
                                    start: data[i].appointmentMeetings[k].date + " " + data[i].appointmentMeetings[k].timeStarted,
                                    end: data[i].appointmentMeetings[k].date + " " + data[i].appointmentMeetings[k].timeFinished,
                                    description: "Location: " + data[i].appointmentMeetings[k].location + " activity: " + data[i].appointmentMeetings[k].notes,
                                    color: color
                                }
                            );
                        } else {
                            GCalendar.addEvent(
                                {  // adds the events for a client so, staff names.
                                    title: data[i].staffMember.firstName + " " + data[i].staffMember.lastName,
                                    start: data[i].appointmentMeetings[k].date + " " + data[i].appointmentMeetings[k].timeStarted,
                                    end: data[i].appointmentMeetings[k].date + " " + data[i].appointmentMeetings[k].timeFinished,
                                    description: "Location: " + data[i].appointmentMeetings[k].location + " activity: " + data[i].appointmentMeetings[k].notes,
                                    color: color
                                }
                            );
                        }
                    }
                }
                if (userRole === "ROLE_STAFF") {
                    GCalendar.addEvent(
                        { // added the staff members upcoming appointments.
                            title: data[i].client.firstName + " " + data[i].client.lastName, // a property!
                            daysOfWeek: [data[i].day], // a property!
                            startTime: data[i].startTime,
                            endTime: data[i].endTime,
                            startRecur: new Date()
                        }
                    );
                } else {
                    GCalendar.addEvent(
                        { // added the client members upcoming appointments.
                            title: data[i].staffMember.firstName + " " + data[i].staffMember.lastName,
                            daysOfWeek: [data[i].day],
                            startTime: data[i].startTime,
                            endTime: data[i].endTime,
                            startRecur: new Date()
                        }
                    );
                }
            }
        }).fail(function (data) {
        alert(data.message);
    });
}

//SupportStaff
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

//MANAGER


//utility functions
function ageIseighteen(id) {
    let Bdate = document.getElementById(id).value;
    let Bday = +new Date(Bdate);
    return ((Date.now() - Bday) / (31557600000)) > 18;

}

function populateClientList(id) {
    let select, option;
    let clients;
    select = document.getElementById(id);
    $.get("http://localhost:8080/Charity/getSupportWorkersClients/",
        function (data) {
            clients = data;
            createMenu(data, option, select);
        }
    ).fail(function (data) {
        alert(data.message);
    });
}

function populateManagerList(id, inform) {
    let select, option;
    let staff;
    select = document.getElementById(id);
    $.get("http://localhost:8080/Staff/getStaffManagers/",
        function (data) {
            staff = data;
            if (staff.length === 0) {
                document.getElementById(inform).innerText = "No staff Manager that can be removed by logged-in user.";
            } else {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].ninNumber !== userID) {
                        option = document.createElement('option');
                        option.value = JSON.stringify(data[i]);
                        option.text = data[i].firstName + " " + data[i].lastName;
                        select.add(option);
                    } else {
                        document.getElementById(inform).innerText = "No staff Managers that can be removed by logged-in user.";
                    }
                }
            }
        }
    ).fail(function (data) {
        alert(data.message);
    });
    $(document).ready(function () {
        $('#' + id).select2();
    });


}

function createMenu(data, option, select) {
    for (let i = 0; i < data.length; i++) {
        option = document.createElement('option');
        option.value = JSON.stringify(data[i]);
        option.text = data[i].firstName + " " + data[i].lastName;
        select.add(option);
    }
}

function populateStaffList(id) {
    let select, option;
    let staff;
    select = document.getElementById(id);
    $.get("http://localhost:8080/Staff/getStaffMembers/",
        function (data) {
            staff = data;
            createMenu(data, option, select);
        }
    ).fail(function (data) {
        alert(data.message);
    });
    $(document).ready(function () {
        $('#' + id).select2();
    });
}

function populateClientListManager(id) {
    let select, option;
    let clients;
    select = document.getElementById(id);
    $.get("http://localhost:8080/Client/getClients/",
        function (data) {
            clients = data;
            createMenu(data, option, select);
        }
    ).fail(function (data) {
        document.getElementById("informAppointment").innerText = data.responseJSON.message;
    });
    $(document).ready(function () {
        $('#' + id).select2();
    });

}

function changeForm(formToShow) {
    let form = $("form", "#forms");
    for (let i = 0; i < form.length; i++) {
        form[i].hidden = formToShow !== form[i].id;
    }
}

function setUpManager() {
    // setting up manager functions
    $("#messaageSystem *").prop('disabled', true).prop('hidden', true);
    $("#supportStaffInfo")[0].hidden = true;

    let btnApp = document.createElement('BUTTON');
    btnApp.innerHTML = "Register an appointment";
    btnApp.onclick = function () {
        openCreateAppointmentForm()
    };
    btnApp.setAttribute("class", "open-button");
    document.getElementById('appointmentController').appendChild(btnApp);

    let btnHouse = document.createElement('BUTTON');
    btnHouse.innerHTML = "Register Support House";
    btnHouse.onclick = function () {
        openCreateHouseForm()
    };
    btnHouse.setAttribute("class", "open-button");
    document.getElementById('SupportedHouseController').appendChild(btnHouse);

    let btnCreateClient = document.createElement('BUTTON');
    btnCreateClient.innerHTML = "Register a new supported client";
    btnCreateClient.onclick = function () {
        openCreateClientForm()
    };
    btnCreateClient.setAttribute("class", "open-button");
    document.getElementById('clientController').appendChild(btnCreateClient);

    let btnCreateStaff = document.createElement('BUTTON');
    btnCreateStaff.innerHTML = "Register new staff member";
    btnCreateStaff.onclick = function () {
        openCreateStaffForm()
    };
    btnCreateStaff.setAttribute("class", "open-button");
    document.getElementById('staffController').appendChild(btnCreateStaff);

    let btnRemoveHouse = document.createElement('BUTTON');
    btnRemoveHouse.innerHTML = "Remove Supported House";
    btnRemoveHouse.onclick = function () {
        openRemoveHouseForm()
    };
    btnRemoveHouse.setAttribute("class", "open-button");
    document.getElementById('SupportedHouseController').appendChild(btnRemoveHouse);

    let btnUpdateHouse = document.createElement('BUTTON');
    btnUpdateHouse.innerHTML = "Update a supported house.";
    btnUpdateHouse.onclick = function () {
        openUpdateSupportHouse()
    };
    btnUpdateHouse.setAttribute("class", "open-button");
    document.getElementById('SupportedHouseController').appendChild(btnUpdateHouse);

    let btnChangeHouse = document.createElement('BUTTON');
    btnChangeHouse.innerHTML = "Change client's support house";
    btnChangeHouse.onclick = function () {
        openChangeHouseForm()
    };
    btnChangeHouse.setAttribute("class", "open-button");
    document.getElementById('clientController').appendChild(btnChangeHouse);

    let btnRemoveStaffApp = document.createElement('BUTTON');
    btnRemoveStaffApp.innerHTML = "Remove Staff Appointment";
    btnRemoveStaffApp.onclick = function () {
        openRemoveStaffApp()
    };
    btnRemoveStaffApp.setAttribute("class", "open-button");
    document.getElementById('appointmentController').appendChild(btnRemoveStaffApp);

    let btnRemoveClientApp = document.createElement('BUTTON');
    btnRemoveClientApp.innerHTML = "Remove Client Appointment";
    btnRemoveClientApp.onclick = function () {
        openRemoveClientApp()
    };
    btnRemoveClientApp.setAttribute("class", "open-button");
    document.getElementById('appointmentController').appendChild(btnRemoveClientApp);

    let btnRemoveStaff = document.createElement('BUTTON');
    btnRemoveStaff.innerHTML = "Remove a staff member";
    btnRemoveStaff.onclick = function () {
        openRemoveStaffMember()
    };
    btnRemoveStaff.setAttribute("class", "open-button");
    document.getElementById('staffController').appendChild(btnRemoveStaff);

    let btnRemoveClient = document.createElement('BUTTON');
    btnRemoveClient.innerHTML = "Remove a supported client";
    btnRemoveClient.onclick = function () {
        openRemoveClient()
    };
    btnRemoveClient.setAttribute("class", "open-button");
    document.getElementById('clientController').appendChild(btnRemoveClient);

    let btnRemoveManager = document.createElement('BUTTON');
    btnRemoveManager.innerHTML = "Remove a staff manager";
    btnRemoveManager.onclick = function () {
        openRemoveStaffManager()
    };
    btnRemoveManager.setAttribute("class", "open-button");
    document.getElementById('staffController').appendChild(btnRemoveManager);

    let btnClientDetails = document.createElement('BUTTON');
    btnClientDetails.innerHTML = "Display/Edit a client's details.";
    btnClientDetails.onclick = function () {
        openDisplayClientsDetails()
    };
    btnClientDetails.setAttribute("class", "open-button");
    document.getElementById('clientController').appendChild(btnClientDetails);

    let btnStaffDetails = document.createElement('BUTTON');
    btnStaffDetails.innerHTML = "Display/Edit a staff's details.";
    btnStaffDetails.onclick = function () {
        openDisplayStaffsDetails()
    };
    btnStaffDetails.setAttribute("class", "open-button");
    document.getElementById('staffController').appendChild(btnStaffDetails);

    let btnDisplayClientsApp = document.createElement('BUTTON');
    btnDisplayClientsApp.innerHTML = "Display a client's Appointments.";
    btnDisplayClientsApp.onclick = function () {
        openDisplayClientsApp()
    };
    btnDisplayClientsApp.setAttribute("class", "open-button");
    document.getElementById('clientController').appendChild(btnDisplayClientsApp);

    let btnDisplayStaffApp = document.createElement('BUTTON');
    btnDisplayStaffApp.innerHTML = "Display a staff's Appointments.";
    btnDisplayStaffApp.onclick = function () {
        openDisplayStaffsApp()
    };
    btnDisplayStaffApp.setAttribute("class", "open-button");
    document.getElementById('staffController').appendChild(btnDisplayStaffApp);

    let btnDisplayClientsNotes = document.createElement('BUTTON');
    btnDisplayClientsNotes.innerHTML = "Display a client's Notes.";
    btnDisplayClientsNotes.onclick = function () {
        openDisplayClientsNotes()
    };
    btnDisplayClientsNotes.setAttribute("class", "open-button");
    document.getElementById('clientController').appendChild(btnDisplayClientsNotes);

}

function removeSelectItems(id) {
    let select = document.getElementById(id);
    let i;
    for (i = select.options.length - 1; i >= 1; i--) {
        select.remove(i);
    }
}

//sort functions for messages.
function sortByListName() {
    sortListName("newMessages");
    sortListName("readMessages");
}

function sortListName(listName) {
    //code from https://www.w3schools.com/howto/howto_js_sort_list.asp
    let list, i, switching, b, shouldSwitch;
    list = document.getElementById(listName);
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        b = list.getElementsByTagName("LI");
        // Loop through all list items:
        for (i = 0; i < (b.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Check if the next item should
            switch place with the current item: */
            //JSON.parse(opt.value)
            if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
                /* If next item is alphabetically lower than current item,
                mark as a switch and break the loop: */
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark the switch as done: */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
        }
    }
}

function sortByListPriority() {
    sortListPriority("newMessages");
    sortListPriority("readMessages");
}

function sortListPriority(listName) {
    //code from https://www.w3schools.com/howto/howto_js_sort_list.asp
    let list, i, switching, b, shouldSwitch, b1, b2;
    list = document.getElementById(listName);
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        b = list.getElementsByTagName("LI");
        // Loop through all list items:
        for (i = 0; i < (b.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Check if the next item should
            switch place with the current item: */
            b1 = b[i].innerHTML;
            // look for and match of
            b1 = b1.match(new RegExp(/( of )\w+/g));
            b2 = b[i + 1].innerHTML;
            b2 = b2.match(new RegExp(/( of )\w+/g));
            if (b1 > b2) {
                /* If next item is alphabetically lower than current item,
                mark as a switch and break the loop: */
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark the switch as done: */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
        }
    }
}

function sortByListDate() {
    sortListDate("newMessages");
    sortListDate("readMessages");
}

function sortListDate(listName) {
    //code from https://www.w3schools.com/howto/howto_js_sort_list.asp
    let list, i, switching, b, shouldSwitch, b1, b2;
    list = document.getElementById(listName);
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        b = list.getElementsByTagName("LI");
        // Loop through all list items:
        for (i = 0; i < (b.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Check if the next item should
            switch place with the current item: */
            b1 = b[i].innerHTML;
            // look for and match of
            b1 = b1.match(new RegExp(/(, received on )\w+/g));
            b2 = b[i + 1].innerHTML;
            b2 = b2.match(new RegExp(/(, received on )\w+/g));
            if (b1 > b2) {
                /* If next item is alphabetically lower than current item,
                mark as a switch and break the loop: */
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark the switch as done: */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
        }
    }
}

$(document).ready(function () {
    // calls the loadCalendar and passes it the Role of the logged in user.
    $.get("http://localhost:8080/Charity/getLoggedInRole/",
        function (data) {
            loadCalendar(data);
            userRole = data;
            if (userRole !== "ROLE_MANAGER" && userRole !== "ROLE_CLIENT") {
                loadNotes();
                behavioralSignsMissedAppOneSup();
                behavioralSignsMissedAppAll();

            } else if (userRole === "ROLE_MANAGER") {
                setUpManager();
            }
            $.get("http://localhost:8080/Charity/getLoggedInID/",
                function (data) {
                    userID = data;

                }).fail(function (data) {
                alert(data.message);
            });
        }
    ).fail(function (data) {
        alert(data.message);
    });
});