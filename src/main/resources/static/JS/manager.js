//APPOINTMENTS
//function relating to creating a Appointment
function openCreateAppointmentForm() {
    document.getElementById("informAppointment").innerText = "";
    let select = document.getElementById("clientForAppointment");
    let i;
    for (i = select.options.length - 1; i >= 1; i--) {
        select.remove(i);
    }
    select = document.getElementById("staffMembers");
    for (i = select.options.length - 1; i >= 0; i--) {
        select.remove(i);
    }
    select.hidden = true;
    $("#CreateAppointmentForm *").val("");
    changeForm("CreateAppointmentForm");
    document.getElementById("informAppointment").scrollIntoView();

    //populate list of clients.
    populateClientListManager("clientForAppointment", "informAppointment");
}

function getAppropriateStaff() {
    let selectClient = document.getElementById("clientForAppointment");
    let opt = selectClient.options[selectClient.selectedIndex];
    let clientID = JSON.parse(opt.value);

    let select = document.getElementById("staffMembers");
    let option;
    let i;
    for (i = select.options.length - 1; i >= 0; i--) {
        select.remove(i);
    }

    $.get("http://localhost:8080/Charity/getAppropriateStaff/",
        {
            clientNationalHealthServiceNumber: clientID.nationalHealthServiceNumber
        },
        function (data) {
            for (let i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.value = JSON.stringify(data[i]);
                option.text = data[i].firstName + "  " + data[i].lastName;
                select.add(option);
            }
            if (data.length === 0) {
                option = document.createElement('option');
                option.value = JSON.stringify(data[i]);
                option.text = "no Staff available.";
                select.add(option);
            }
            select.hidden = false;
        }
    ).fail(function () {
    });

}

function submitCreateAppointment() {

    let select = document.getElementById("clientForAppointment");
    let opt = select.options[select.selectedIndex];
    let clientID = JSON.parse(opt.value);

    select = document.getElementById("staffMembers");
    opt = select.options[select.selectedIndex];
    let staffMembersID = JSON.parse(opt.value);

    select = document.getElementById("day");
    let day = select.options[select.selectedIndex].text;

    $.post(
        "http://localhost:8080/Charity/createAnAppointment/",
        {
            day: day,
            startTime: document.getElementById("startTime").value,
            endTime: document.getElementById("endTime").value,
            NHSnumber: clientID.nationalHealthServiceNumber,
            ninNumber: staffMembersID.ninNumber,
        },
        function (data) {
            document.getElementById("informAppointment").innerText = "Appointment successfully created";
        }).fail(function (data) {
        document.getElementById("informAppointment").innerText = data.responseJSON.message;
    });
}


//removing a staff members appointment.
function openRemoveStaffApp() {

    document.getElementById("informRemoveStaffApp").innerText = "";
    let select = document.getElementById("staffRemoveApp");
    let i;
    for (i = select.options.length - 1; i >= 1; i--) {
        select.remove(i);
    }

    select = document.getElementById("appToRemoveStaff");
    for (i = select.options.length - 1; i >= 0; i--) {
        select.remove(i);
    }
    select.hidden = true;
    document.getElementById("appToRemoveStaffLabel").hidden = true;

    changeForm("openRemoveStaffApp");

    populateStaffList("staffRemoveApp");
    document.getElementById("informRemoveStaffApp").scrollIntoView();


}

function getStaffAppointments() {
    let day;

    document.getElementById("appToRemoveStaffLabel").hidden = false;
    let select = document.getElementById("staffRemoveApp");
    let opt = select.options[select.selectedIndex];
    let staffID = JSON.parse(opt.value);

    select = document.getElementById("appToRemoveStaff");
    let option;

    $.get("http://localhost:8080/Charity/getAppointmentsFor/",
        {
            ID: staffID.ninNumber
        },
        function (data) {
            for (let i = 0; i < data.length; i++) {
                // day number to word
                switch (data[i].day) {
                    case 1:
                        day = "Monday";
                        break;
                    case 2:
                        day = "Tuesday";
                        break;
                    case 3:
                        day = "Wednesday";
                        break;
                    case 4:
                        day = "Thursday";
                        break;
                    case 5:
                        day = "Friday";
                        break;
                    case 6:
                        day = "Saturday";
                        break;
                    case 7:
                        day = "Sunday";
                }

                option = document.createElement('option');
                option.value = JSON.stringify(data[i]);
                option.text = "App with : " + data[i].client.firstName + " " + data[i].client.lastName + " on : " + day + " at: " + data[i].startTime;
                select.add(option);
            }
            if (data.length === 0) {
                option = document.createElement('option');
                option.text = "No appointments to remove.";
                document.getElementById("informRemoveStaffApp").innerText = "The staff member has no registered appointments with any client.";
                select.add(option);
            }
            select.hidden = false;
        }).fail(function (data) {
        document.getElementById("informRemoveStaffApp").innerText = data.responseJSON.message;
    });
}

function submitRemoveStaffApp() {
    let day;
    let select = document.getElementById("staffRemoveApp");
    let opt = select.options[select.selectedIndex];
    let staffID = JSON.parse(opt.value);

    select = document.getElementById("appToRemoveStaff");
    opt = select.options[select.selectedIndex];
    let appInfo = JSON.parse(opt.value);

    switch (appInfo.day) {
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
            day = "STATURDAY";
            break;
        case 7:
            day = "SUNDAY";
    }

    let url = "http://localhost:8080/Charity/removeAnAppointment/";
    $.ajax({
        url: url,
        type: "DELETE",
        data: {
            day: day,
            startTime: appInfo.startTime,
            endTime: appInfo.endTime,
            NHSnumber: appInfo.client.nationalHealthServiceNumber,
            ninNumber: staffID.ninNumber
        },
        success: function () {
            document.getElementById("informRemoveStaffApp").innerText = "Appointment has been successfully removed.";
            select = document.getElementById("appToRemoveStaff");
            let i;
            for (i = select.options.length - 1; i >= 1; i--) {
                select.remove(i);
            }

        }
    }).fail(function (data) {
        document.getElementById("informRemoveStaffApp").innerText = data.responseJSON.message;
    });
}

// functions relating to removing a client's Appointment.
function openRemoveClientApp() {

    document.getElementById("informRemoveClientApp").innerText = "";
    let select = document.getElementById("clientRemoveApp");
    let i;
    for (i = select.options.length - 1; i >= 1; i--) {
        select.remove(i);
    }

    select = document.getElementById("appToRemoveClient");
    for (i = select.options.length - 1; i >= 0; i--) {
        select.remove(i);
    }
    select.hidden = true;
    document.getElementById("appToRemoveClientLabel").hidden = true;

    changeForm("openRemoveClientApp");

    populateClientListManager("clientRemoveApp", "informRemoveClientApp");
    document.getElementById("informRemoveClientApp").scrollIntoView();

}

function getClientAppointments() {
    let day;

    document.getElementById("appToRemoveClientLabel").hidden = false;
    let select = document.getElementById("clientRemoveApp");
    let opt = select.options[select.selectedIndex];
    let clientID = JSON.parse(opt.value);

    select = document.getElementById("appToRemoveClient");
    let option;

    $.get("http://localhost:8080/Charity/getAppointmentsFor/",
        {
            ID: clientID.nationalHealthServiceNumber
        },
        function (data) {
            for (let i = 0; i < data.length; i++) {
                // day number to word
                switch (data[i].day) {
                    case 1:
                        day = "Monday";
                        break;
                    case 2:
                        day = "Tuesday";
                        break;
                    case 3:
                        day = "Wednesday";
                        break;
                    case 4:
                        day = "Thursday";
                        break;
                    case 5:
                        day = "Friday";
                        break;
                    case 6:
                        day = "Saturday";
                        break;
                    case 7:
                        day = "Sunday";
                }

                option = document.createElement('option');
                option.value = JSON.stringify(data[i]);
                option.text = "App with : " + data[i].staffMember.firstName + " " + data[i].staffMember.lastName + " on : " + day + " at: " + data[i].startTime;
                select.add(option);
            }
            if (data.length === 0) {
                option = document.createElement('option');
                option.text = "No appointments to remove.";
                document.getElementById("informRemoveClientApp").innerText = "The client has no registered appointments with any staff members.";
                select.add(option);
            }
            select.hidden = false;
        }).fail(function (data) {
        document.getElementById("informRemoveClientApp").innerText = data.responseJSON.message;
    });
}

function submitRemoveClientApp() {
    let day;
    let select = document.getElementById("clientRemoveApp");
    let opt = select.options[select.selectedIndex];
    let clientID = JSON.parse(opt.value);

    select = document.getElementById("appToRemoveClient");
    opt = select.options[select.selectedIndex];
    let appInfo = JSON.parse(opt.value);

    switch (appInfo.day) {
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
            day = "STATURDAY";
            break;
        case 7:
            day = "SUNDAY";
    }

    let url = "http://localhost:8080/Charity/removeAnAppointment/";
    $.ajax({
        url: url,
        type: "DELETE",
        data: {
            day: day,
            startTime: appInfo.startTime,
            endTime: appInfo.endTime,
            ninNumber: appInfo.staffMember.ninNumber,
            NHSnumber: clientID.nationalHealthServiceNumber
        },
        success: function () {
            document.getElementById("informRemoveClientApp").innerText = "Appointment has been successfully removed.";
            select = document.getElementById("appToRemoveClient");
            let i;
            for (i = select.options.length - 1; i >= 1; i--) {
                select.remove(i);
            }

        }
    }).fail(function (data) {
        document.getElementById("informRemoveClientApp").innerText = data.responseJSON.message;
    });
}

//CLIENTS
//functions relating to registering a client.
function openCreateClientForm() {
    document.getElementById("informClient").innerText = "";
    $("#createClientForm *").val("");
    changeForm("createClientForm");
    document.getElementById("informClient").scrollIntoView();
}

function submitClientForm() {
    let select = document.getElementById("clientSupportHouse");
    let opt = select.options[select.selectedIndex];
    let supportHouse = JSON.parse(opt.value);
    let username;

    if (opt.text === "Select a sex and Condition first" || opt.text === "no Supported House available.") {
        document.getElementById("informClient").innerText = "no Supported House available for this perspective Client.";

    } else {
        if (!ageIseighteen("clientDOB")) {
            document.getElementById("informClient").innerText = "Clients must be over eighteen years old.";

        } else {
            $.post(
                "http://localhost:8080/Client/registerClient/",
                {
                    firstName: document.getElementById("clientFirstName").value,
                    lastName: document.getElementById("ClientLastName").value,
                    sex: $("input[name='clientGender']:checked")[0].labels[0].outerText,
                    dateOfBirth: document.getElementById("clientDOB").value,
                    generalCondition: $("input[name='clientSpec']:checked")[0].labels[0].outerText,
                    nextOfKin: document.getElementById("clientsNextOfKin").value,
                    nextOfKinNumber: document.getElementById("clientsNextOfKinNumber").value,
                    diagnosis: document.getElementById("clientsDiagnosis").value,
                    nationalHealthServiceNumber: document.getElementById("clientsNHSnumber").value,
                    password: document.getElementById("clientsPassword").value,
                },
                function (data) {
                    username = data;

                    $.post(
                        "http://localhost:8080/Charity/registerClientInSupportedHouse/",
                        {
                            houseName: supportHouse.houseName,
                            NHSnumber: document.getElementById("clientsNHSnumber").value
                        },
                        function (data) {
                            document.getElementById("informClient").innerText = "Client successfully created" + " Username: " + username;

                        }).fail(function (data) {
                        document.getElementById("informClient").innerText = data.responseJSON.message;
                    });
                }).fail(function (data) {
                document.getElementById("informClient").innerText = data.responseJSON.message;
            });
        }
    }
}

function checkHouse() {
    // language=JQuery-CSS
    let clientSex = $("input[name='clientGender']:checked");
    if (clientSex.length > 0) {
        clientSex = clientSex[0].labels[0].outerText;
    }
    // language=JQuery-CSS
    let clientCondition = $("input[name='clientSpec']:checked");
    if (clientCondition.length > 0) {
        clientCondition = clientCondition[0].labels[0].outerText;
    }

    if (typeof clientSex !== 'undefined' && typeof clientCondition !== 'undefined') {
        let select = document.getElementById("clientSupportHouse");
        let option;
        let i;
        for (i = select.options.length - 1; i >= 1; i--) {
            select.remove(i);
        }
        $.get("http://localhost:8080/Charity/getSpecificSupportedHouse/",
            {
                sex: clientSex,
                aoe: clientCondition
            },
            function (data) {
                for (let i = 0; i < data.length; i++) {
                    option = document.createElement('option');
                    option.value = JSON.stringify(data[i]);
                    option.text = data[i].houseName;
                    select.add(option);

                }
                if (data.length === 0) {
                    option = document.createElement('option');
                    option.value = JSON.stringify(data[i]);
                    option.text = "no Supported House available.";
                    select.add(option);
                }
            }
        ).fail(function (data) {
            alert(data.message);
        });

    }
}

// functions relating to removing a Client
function openRemoveClient() {
    document.getElementById("informRemoveClient").innerText = "";
    removeSelectItems("clientRemove");
    $("#openRemoveClient *").val("");
    changeForm("openRemoveClient");
    populateClientListManager("clientRemove", "informRemoveClient");
    document.getElementById("informRemoveClient").scrollIntoView();

}

function submitRemoveClient() {

    let select = document.getElementById("clientRemove");
    let opt = select.options[select.selectedIndex];
    let ClientID = JSON.parse(opt.value);

    $.get(
        "http://localhost:8080/Charity/getAppointmentsFor/",
        {
            ID: ClientID.nationalHealthServiceNumber
        },
        function (data) {
            if (data.length === 0) {

                url = "http://localhost:8080/Charity/removeClientFromSupportedHouse/";
                $.ajax({
                    url: url,
                    type: "DELETE",
                    data: {
                        houseName: ClientID.currentSupportedHouseObject.houseName,
                        NHSnumber: ClientID.nationalHealthServiceNumber
                    },
                    success: function () {
                        let url = "http://localhost:8080/Client/removeClient/";
                        $.ajax({
                            url: url,
                            type: "DELETE",
                            data: {
                                nationalHealthServiceNumber: ClientID.nationalHealthServiceNumber
                            },
                            success: function () {
                                document.getElementById("informRemoveClient").innerText = "Client has ben successfully removed.";

                                select = document.getElementById("clientRemove");
                                let i;
                                for (i = select.options.length - 1; i >= 1; i--) {
                                    select.remove(i);
                                }

                            }
                        }).fail(function (data) {
                            document.getElementById("informRemoveClient").innerText = data.responseJSON.message;
                        });
                    }
                });


            } else {
                document.getElementById("informRemoveClient").innerText = "client cannot be removed as they still have appointments.";
            }
        }).fail(function (data) {
        document.getElementById("informRemoveClient").innerText = data.responseJSON.message;
    });

}

// functions relating to displaying or editing a client's details.
function openDisplayClientsDetails() {
    document.getElementById("informClientDetails").innerText = "";
    removeSelectItems("clientDetails");
    $("#createClientDetails *").val("");
    changeForm("createClientDetails");
    populateClientListManager("clientDetails", "informClientDetails");
    document.getElementById("informClientDetails").scrollIntoView();
}

function onClientSelectEdit() {
    let select = document.getElementById("clientDetails");
    let opt = select.options[select.selectedIndex];
    let clientID = JSON.parse(opt.value);

    document.getElementById("clientEditSupportHouse").value = clientID.currentSupportedHouseObject.houseName;
    document.getElementById("clientEditFirstName").value = clientID.firstName;
    document.getElementById("clientEditLastName").value = clientID.lastName;
    document.getElementById("clientsEditUsername").value = clientID.username;
    document.getElementById("clientsGender").value = clientID.sex;
    document.getElementById("clientEditDOB").value = clientID.dateOfBirth;
    document.getElementById("clientsSpecialisation").value = clientID.generalCondition;
    document.getElementById("clientsEditNextOfKin").value = clientID.nextOfKin;
    document.getElementById("clientsEditNextOfKinNumber").value = clientID.nextOfKinNumber;
    document.getElementById("clientsEditDiagnosis").value = clientID.diagnosis;
    document.getElementById("clientsEditNHSnumber").value = clientID.nationalHealthServiceNumber;

}

function submitClientDetails() {
    $.post(
        "http://localhost:8080/Client/updateClient/",
        {
            lastName: document.getElementById("clientEditLastName").value,
            nextOfKin: document.getElementById("clientsEditNextOfKin").value,
            nextOfKinNumber: document.getElementById("clientsEditNextOfKinNumber").value,
            diagnosis: document.getElementById("clientsEditDiagnosis").value,
            nationalHealthServiceNumber: document.getElementById("clientsEditNHSnumber").value,
        },
        function () {
            document.getElementById("informClientDetails").innerText = "Client's detail have been updated";
            removeSelectItems("clientDetails");
            $("#createClientDetails *").val("");
            populateClientListManager("clientDetails", "informClientDetails");
        }).fail(function (data) {
        document.getElementById("informClientDetails").innerText = data.responseJSON.message;
    });

}

function openDisplayClientsApp() {

    document.getElementById("informClientDisplayAppDetails").innerText = "";
    removeSelectItems("clientAppDetails");
    if (typeof managerCalender !== "undefined") {
        managerCalender.destroy();
    }
    $("#DisplayClientAppDetails *").val("");
    changeForm("DisplayClientAppDetails");
    populateClientListManager("clientAppDetails", "informClientDisplayAppDetails");
    document.getElementById("informClientDisplayAppDetails").scrollIntoView();

    let calendarEl = document.getElementById('clientCalendar');
    managerCalender = new FullCalendar.Calendar(calendarEl, {
        plugins: ['timeGrid', 'dayGrid', 'bootstrap'],
        header: {right: 'dayGridMonth,timeGridWeek,today prev,next'},
        minTime: '06:00:00',
        maxTime: '20:00:00',
        themeSystem: 'bootstrap',
        height: 650,

        eventRender: function (info) {
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
    });
}

function onClientSelectDisplayApp() {

    let select = document.getElementById("clientAppDetails");
    let opt = select.options[select.selectedIndex];
    let clientID = JSON.parse(opt.value);

    if (typeof managerCalender !== "undefined") {
        managerCalender.destroy();
    }

    let color;
    $.get(
        "http://localhost:8080/Charity/getAppointmentsFor/",
        {
            ID: clientID.nationalHealthServiceNumber
        },
        function (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].appointmentMeetings.length > 0) {
                    for (let k = 0; k < data[i].appointmentMeetings.length; k++) {
                        color = data[i].appointmentMeetings[k].cancelled === true ? "red" : "green";
                        managerCalender.addEvent(
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
                managerCalender.addEvent(
                    { // added the client members upcoming appointments.
                        title: data[i].staffMember.firstName + " " + data[i].staffMember.lastName,
                        daysOfWeek: [data[i].day],
                        startTime: data[i].startTime,
                        endTime: data[i].endTime,
                        startRecur: new Date()
                    });
            }
        }).fail(function (data) {
        alert(data.message);
    });

    managerCalender.render();
}

//STAFF/MANAGER
//functions relating to registering a staff member.
function openCreateStaffForm() {
    document.getElementById("informStaff").innerText = "";
    $("#createStaffForm *").val("");
    changeForm("createStaffForm");
    document.getElementById("informStaff").scrollIntoView();
}

function submitStaffForm() {
    if (!ageIseighteen("staffDOB")) {
        document.getElementById("informStaff").innerText = "Staff members must be over eighteen years old.";

    } else {
        $.post(
            "http://localhost:8080/Staff/registerStaffMember/",
            {
                firstName: document.getElementById("staffFirstName").value,
                lastName: document.getElementById("staffLastName").value,
                sex: $("input[name='staffGender']:checked")[0].labels[0].outerText,
                dateOfBirth: document.getElementById("staffDOB").value,
                addressFirstLine: document.getElementById("staffAddressFirstLine").value,
                addressSecondLine: document.getElementById("staffAddressSecondLine").value,
                country: document.getElementById("staffCountry").value,
                town: document.getElementById("staffTown").value,
                postCode: document.getElementById("staffPostCode").value,
                ninNumber: document.getElementById("staffNin").value,
                areaOfExperience: $("input[name='staffSpec']:checked")[0].labels[0].outerText,
                manager: $("input[name='staffIsManager']:checked")[0].labels[0].outerText,
                password: document.getElementById("staffPassword").value,
            },
            function (data) {
                document.getElementById("informStaff").innerText = "Staff Member successfully created" + " Username: " + data;

            }).fail(function (data) {
            document.getElementById("informStaff").innerText = data.responseJSON.message;
        });
    }
}

function openRemoveStaffMember() {
    document.getElementById("informRemoveStaff").innerText = "";
    let select = document.getElementById("staffRemove");
    let i;
    for (i = select.options.length - 1; i >= 1; i--) {
        select.remove(i);
    }
    $("#openRemoveStaff *").val("");
    changeForm("openRemoveStaff");

    populateStaffList("staffRemove");
    document.getElementById("informRemoveStaff").scrollIntoView();
}

function submitRemoveStaff() {

    let select = document.getElementById("staffRemove");
    let opt = select.options[select.selectedIndex];
    let staffID = JSON.parse(opt.value);

    $.get(
        "http://localhost:8080/Charity/getAppointmentsFor/",
        {
            ID: staffID.ninNumber
        },
        function (data) {
            if (data.length === 0) {
                let url = "http://localhost:8080/Staff/deleteStaffMember/";
                $.ajax({
                    url: url,
                    type: "DELETE",
                    data: {
                        ninNumber: staffID.ninNumber
                    },
                    success: function () {
                        document.getElementById("informRemoveStaff").innerText = "Staff member has ben successfully removed.";

                        removeSelectItems("staffRemove");

                    }
                }).fail(function (data) {
                    document.getElementById("informRemoveStaff").innerText = data.responseJSON.message;
                });
            } else {
                document.getElementById("informRemoveStaff").innerText = "Staff member cannot be removed as they still have appointments.";
            }
        }).fail(function (data) {
        document.getElementById("informRemoveStaff").innerText = data.responseJSON.message;
    });


}

function openDisplayStaffsApp() {

    document.getElementById("informStaffDisplayAppDetails").innerText = "";
    removeSelectItems("staffAppDetails");
    if (typeof managerCalender !== "undefined") {
        managerCalender.destroy();
    }
    $("#DisplayStaffAppDetails *").val("");
    changeForm("DisplayStaffAppDetails");
    populateStaffList("staffAppDetails");
    document.getElementById("informStaffDisplayAppDetails").scrollIntoView();


    let calendarEl = document.getElementById('staffCalendar');
    managerCalender = new FullCalendar.Calendar(calendarEl, {
        plugins: ['timeGrid', 'dayGrid', 'bootstrap'],
        header: {right: 'dayGridMonth,timeGridWeek,today prev,next'},
        minTime: '06:00:00',
        maxTime: '20:00:00',
        themeSystem: 'bootstrap',
        height: 650,

        eventRender: function (info) {
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
    });
}

function onStaffSelectDisplayApp() {

    let select = document.getElementById("staffAppDetails");
    let opt = select.options[select.selectedIndex];
    let staffID = JSON.parse(opt.value);

    if (typeof managerCalender !== "undefined") {
        managerCalender.destroy();
    }

    let color;
    $.get(
        "http://localhost:8080/Charity/getAppointmentsFor/",
        {
            ID: staffID.ninNumber
        },
        function (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].appointmentMeetings.length > 0) {
                    for (let k = 0; k < data[i].appointmentMeetings.length; k++) {
                        color = data[i].appointmentMeetings[k].cancelled === true ? "red" : "green";
                        managerCalender.addEvent(
                            { // adds the events for a Staff member so, client names.
                                title: data[i].client.firstName + " " + data[i].client.lastName,
                                start: data[i].appointmentMeetings[k].date + " " + data[i].appointmentMeetings[k].timeStarted,
                                end: data[i].appointmentMeetings[k].date + " " + data[i].appointmentMeetings[k].timeFinished,
                                description: "Location: " + data[i].appointmentMeetings[k].location + " activity: " + data[i].appointmentMeetings[k].notes,
                                color: color
                            }
                        );
                    }
                }
                managerCalender.addEvent(
                    { // added the staff members upcoming appointments.
                        title: data[i].client.firstName + " " + data[i].client.lastName, // a property!
                        daysOfWeek: [data[i].day], // a property!
                        startTime: data[i].startTime,
                        endTime: data[i].endTime,
                        startRecur: new Date()
                    });
            }
        }).fail(function (data) {
        alert(data.message);
    });

    managerCalender.render();
}

//functions relating to removing a staff Manager
function openRemoveStaffManager() {
    document.getElementById("informRemoveStaffManager").innerText = "";
    removeSelectItems("staffManagerRemove");
    $("#openRemoveStaffManager *").val("");
    changeForm("openRemoveStaffManager");
    populateManagerList("staffManagerRemove", "informRemoveStaffManager");
    document.getElementById("informRemoveStaffManager").scrollIntoView();
}

function submitRemoveStaffManager() {
    let select = document.getElementById("staffManagerRemove");
    let opt = select.options[select.selectedIndex];
    let staffID = JSON.parse(opt.value);

    let url = "http://localhost:8080/Staff/deleteStaffMember/";
    $.ajax({
        url: url,
        type: "DELETE",
        data: {
            ninNumber: staffID.ninNumber
        },
        success: function () {
            document.getElementById("informRemoveStaffManager").innerText = "Staff Manager has been successfully removed.";
            removeSelectItems("staffManagerRemove");

        }
    }).fail(function (data) {
        document.getElementById("informRemoveStaffManager").innerText = data.responseJSON.message;
    });


}

//functions relating to displaying or editing a Staff's details
function openDisplayStaffsDetails() {

    document.getElementById("informStaffDetails").innerText = "";
    removeSelectItems("staffDetails");
    $("#createStaffDetails *").val("");
    changeForm("createStaffDetails");
    populateStaffList("staffDetails");
    populateManagerList("staffDetails", "informStaffDetails");
    document.getElementById("informStaffDetails").scrollIntoView();

}

function onStaffSelectEdit() {
    let select = document.getElementById("staffDetails");
    let opt = select.options[select.selectedIndex];
    let staffID = JSON.parse(opt.value);

    document.getElementById("staffEditFirstName").value = staffID.firstName;
    document.getElementById("staffEditLastName").value = staffID.lastName;
    document.getElementById("staffEditUsername").value = staffID.username;
    document.getElementById("staffEditGender").value = staffID.sex;
    document.getElementById("staffEditDOB").value = staffID.dateOfBirth;
    document.getElementById("staffEditSpec").value = staffID.areaOfExperience;
    document.getElementById("staffEditNin").value = staffID.ninNumber;
    document.getElementById("staffEditAddressFirstLine").value = staffID.address.addressFirstLine;
    document.getElementById("staffEditAddressSecondLine").value = staffID.address.addressSecondLine;
    document.getElementById("staffEditCountry").value = staffID.address.country;
    document.getElementById("staffEditTown").value = staffID.address.town;
    document.getElementById("staffEditPostCode").value = staffID.address.postCode;

}

function submitStaffDetails() {
    $.post(
        "http://localhost:8080/Staff/updateStaffMember/",
        {
            lastName: document.getElementById("staffEditLastName").value,
            addressFirstLine: document.getElementById("staffEditAddressFirstLine").value,
            addressSecondLine: document.getElementById("staffEditAddressSecondLine").value,
            country: document.getElementById("staffEditCountry").value,
            town: document.getElementById("staffEditTown").value,
            postCode: document.getElementById("staffEditPostCode").value,
            ninNumber: document.getElementById("staffEditNin").value,
        },
        function () {
            document.getElementById("informStaffDetails").innerText = "Staff member's detail have been updated";
            removeSelectItems("staffDetails");
            $("#createStaffDetails *").val("");
            populateStaffList("staffDetails");
            populateManagerList("staffDetails", "informStaffDetails");
        }).fail(function (data) {
        document.getElementById("informStaffDetails").innerText = data.responseJSON.message;
    });

}

//SUPPORTED HOUSE
//functions relating to creating support houses.
function openCreateHouseForm() {
    document.getElementById("informHouse").innerText = "";
    $("#createSupportHouse *").val("");
    changeForm("createSupportHouse");
    document.getElementById("informHouse").scrollIntoView();
}

function submitCreateHouseForm() {
    $.post(
        "http://localhost:8080/SupportedHouse/registerSupportedHouse/",
        {
            houseName: document.getElementById("houseName").value,
            // language=JQuery-CSS
            gender: $("input[name='inlineRadioOptionsSex']:checked")[0].labels[0].outerText,
            // language=JQuery-CSS
            specificCondition: $("input[name='inlineRadioOptionsSpec']:checked")[0].labels[0].outerText,
            addressFirstLine: document.getElementById("addressFirstLine").value,
            addressSecondLine: document.getElementById("addressSecondLine").value,
            country: document.getElementById("country").value,
            town: document.getElementById("town").value,
            postCode: document.getElementById("postCode").value,
            roomNumber: document.getElementById("room").value,

        },
        function () {
            document.getElementById("informHouse").innerText = "Support House successfully created";
        }).fail(function (data) {
        document.getElementById("informHouse").innerText = data.responseJSON.message;
    });


}

//functions relating to removing support houses.
function openRemoveHouseForm() {
    document.getElementById("informRemoveHouse").innerText = "";
    $("#removeSupportHouse *").val("");
    changeForm("removeSupportHouse");
    document.getElementById("informRemoveHouse").scrollIntoView();

    let select = document.getElementById("selectRemoveHouse");
    let option;
    removeSelectItems("selectRemoveHouse");
    $.get("http://localhost:8080/Charity/getAllUnassignedSupportedHouses/",
        function (data) {
            for (let i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.value = JSON.stringify(data[i]);
                option.text = "House Name: " + data[i].houseName + " postcode: " + data[i].address.postCode;
                select.add(option);
            }
            if (data.length === 0) {
                option = document.createElement('option');
                option.text = "No supported Houses that can be removed.";
                document.getElementById("informRemoveHouse").innerText = "all supported Houses must have clients assigned," +
                    " cannot remove a supported house with assigned clients or no register Support Houses.";
                select.add(option);
            }
            select.hidden = false;
        }
    ).fail(function (data) {
        alert(data.message);
    });

}

function submitRemoveHouse() {
    let select = document.getElementById("selectRemoveHouse");
    let opt = select.options[select.selectedIndex];
    let HouseID = JSON.parse(opt.value);

    let url = "http://localhost:8080/SupportedHouse/removeSupportedHouse/";
    $.ajax({
        url: url,
        type: "DELETE",
        data: {
            houseName: HouseID.houseName
        },
        success: function () {
            document.getElementById("informRemoveHouse").innerText = "successfully removed the supported house " + HouseID.houseName;
            removeSelectItems("selectRemoveHouse");
        }
    });
}

//functions relating to changing a client's support house.
function openChangeHouseForm() {
    document.getElementById("informClientChangeHouse").innerText = "";
    removeSelectItems("clientForChangeHouse");
    $("#createClientForm *").val("");
    changeForm("openChangeHouseForm");
    populateClientListManager("clientForChangeHouse", "informClientChangeHouse");

    document.getElementById("informClientChangeHouse").scrollIntoView();
}

function getNewClientsHouse() {
    let selectClient = document.getElementById("clientForChangeHouse");
    let opt = selectClient.options[selectClient.selectedIndex];
    if (opt.value === "Select a Client") {
        document.getElementById("informClientChangeHouse").innerText = "Please select a Client";
    } else {
        let clientID = JSON.parse(opt.value);
        let select = document.getElementById("clientNewSupportHouse");
        let option;
        removeSelectItems("clientNewSupportHouse");
        $.get("http://localhost:8080/Charity/getSpecificSupportedHouse/",
            {
                sex: clientID.sex,
                aoe: clientID.generalCondition
            },
            function (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].houseName !== clientID.currentSupportedHouseObject.houseName) {
                        option = document.createElement('option');
                        option.value = JSON.stringify(data[i]);
                        option.text = data[i].houseName;
                        select.add(option);
                    }
                }
                if (data.length === 0) {
                    option = document.createElement('option');
                    option.value = JSON.stringify(data[i]);
                    option.text = "no Supported House available.";
                    select.add(option);
                }
            }
        ).fail(function (data) {
            alert(data.message);
        });
    }
}

function submitChangeClientHouse() {
    let select = document.getElementById("clientForChangeHouse");
    let opt = select.options[select.selectedIndex];
    let clientID = JSON.parse(opt.value);

    select = document.getElementById("clientNewSupportHouse");
    opt = select.options[select.selectedIndex];
    let newSupHouse = JSON.parse(opt.value);

    let url = "http://localhost:8080/Charity/removeClientFromSupportedHouse/";
    $.ajax({
        url: url,
        type: "DELETE",
        data: {
            houseName: clientID.currentSupportedHouseObject.houseName,
            NHSnumber: clientID.nationalHealthServiceNumber
        },
        success: function () {
            url = "http://localhost:8080/Charity/registerClientInSupportedHouse/";
            $.ajax({
                url: url,
                type: "POST",
                data: {
                    houseName: newSupHouse.houseName,
                    NHSnumber: clientID.nationalHealthServiceNumber
                },
                success: function () {
                    document.getElementById("informClientChangeHouse").innerText = "successfully Changed the clients supported house to " + newSupHouse.houseName;
                }
            });
        }
    });

}

//functions relating to changing a support house's details.
function openUpdateSupportHouse() {
    document.getElementById("updateHouse").innerText = "";
    $("#updateSupportHouse *").val("");
    changeForm("updateSupportHouse");

    let select = document.getElementById("updateSelectRemoveHouse");
    let option;
    removeSelectItems("updateSelectRemoveHouse");
    $.get("http://localhost:8080/Charity/getAllUnassignedSupportedHouses/",
        function (data) {
            for (let i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.value = JSON.stringify(data[i]);
                option.text = "House Name: " + data[i].houseName + " postcode: " + data[i].address.postCode;
                select.add(option);
            }
            if (data.length === 0) {
                option = document.createElement('option');
                option.text = "No supported Houses that can be updated.";
                document.getElementById("updateHouse").innerText = "all supported Houses have clients assigned," +
                    " cannot update a supported house with assigned clients.";
                select.add(option);
            }
            select.hidden = false;
        }
    ).fail(function (data) {
        alert(data.message);
    });
    document.getElementById("updateHouse").scrollIntoView();
}

function updateSupportedHouseDetails() {

    let select = document.getElementById("updateSelectRemoveHouse");
    let opt = select.options[select.selectedIndex];
    let supportHouseID = JSON.parse(opt.value);

    document.getElementById("updateHouseName").value = supportHouseID.houseName;
    document.getElementById("updateAddressFirstLine").value = supportHouseID.address.addressFirstLine;
    document.getElementById("updateAddressSecondLine").value = supportHouseID.address.addressSecondLine;
    document.getElementById("updateCountry").value = supportHouseID.address.country;
    document.getElementById("updateTown").value = supportHouseID.address.town;
    document.getElementById("updatePostCode").value = supportHouseID.address.postCode;
    document.getElementById("updateRoom").value = supportHouseID.rooms.length;

}