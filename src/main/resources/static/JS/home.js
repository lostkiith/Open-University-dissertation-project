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