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