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
    populateClientListManager("clientForAppointment");
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