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

function populateClientListManager(id, infoID) {
    let select, option;
    let clients;
    select = document.getElementById(id);
    $.get("http://localhost:8080/Client/getClients/",
        function (data) {
            clients = data;
            createMenu(data, option, select);
        }
    ).fail(function (data) {
        document.getElementById(infoID).innerText = data.responseJSON.message;
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