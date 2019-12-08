package TM470Project.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedList;
import java.util.NoSuchElementException;

/**
 * Represents an appointment between a client and staff member.
 * @author Luke Daniels.
 */
@Data
public class Appointment {

    private DayOfWeek day;
    private LocalTime startTime;
    private LocalTime endTime;
    @DBRef
    private Client client;
    @DBRef
    private SupportStaffMember staffMember;
    private LinkedList<AppointmentMeeting> appointmentMeetings;

    @Contract(pure = true)
    private Appointment(@NotNull DayOfWeek day,@NotNull LocalTime startTime,@NotNull LocalTime endTime,@NotNull Client client,@NotNull SupportStaffMember staffMember) {
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
        this.client = client;
        this.staffMember = staffMember;
        appointmentMeetings = new LinkedList<>();
    }

    /**
     * static method to create the object.
     * @param day       The day the appointment will be on.
     * @param startTime The time the appointment will begin.
     * @param endTime   The time the appointment will finish.
     * @param client        The client for the appointment.
     * @param staffMember   The staff member for the appointment
     * @return              returns a Appointment object.
     */
    @NotNull
    @Contract(value = "_, _, _, _, _ -> new", pure = true)
    public static Appointment createAppointment(DayOfWeek day, LocalTime startTime, LocalTime endTime, Client client, SupportStaffMember staffMember) {
        return new Appointment(day, startTime, endTime, client, staffMember);
    }

    /**
     * create an Appointment object.
     * @param timeStarted     The time the appointment started.
     * @param timeFinished    The time the appointment finished.
     * @param location        The location the appointment took place.
     * @param notes           Notes of the appointment.
     * @param date            The date that the appointment was on.
     * @param clientSignature The clients signature.
     */
    public void createAppointmentMeeting(LocalTime timeStarted, LocalTime timeFinished, String location, String notes, LocalDate date, String clientSignature, Boolean cancelled) {
        this.appointmentMeetings.add(AppointmentMeeting.createAppointmentMeeting(timeStarted, timeFinished, location, notes, date, clientSignature, cancelled));
    }

    /**
     * return a appointment meeting object to return.
     * @param date the date of the appointment meeting.
     * @return  the appointment meeting object.
     */
    public AppointmentMeeting getAppointmentMeeting(LocalDate date) {
        for (AppointmentMeeting am : appointmentMeetings) {
            if (am.getDate().equals(date)) {
                return am;
            }
        }
        throw new NoSuchElementException("no appointment meeting on the selected date was found.");
    }

    /**
     * gets the first and last name of the client.
     * @return  the first and last name of the client.
     */
    public Client getClient() {
        return client;
    }

    @JsonIgnore
    public Client getClientObject() {
        return this.client;
    }

    /**
     * get the first and last name of the staff memeber.
     * @return  the first and last name of the staff member.
     */
    public Staff getStaffMember() {
        return staffMember;
    }

    @JsonIgnore
    public Staff getStaffMemberObject() {
        return this.staffMember;
    }

    public int getDay()
    {
        return this.day.getValue();
    }

    DayOfWeek getDayObject()
    {
        return day;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Appointment)) return false;

        Appointment that = (Appointment) o;

        if (day != that.day) return false;
        if (!startTime.equals(that.startTime)) return false;
        if (!endTime.equals(that.endTime)) return false;
        if (!client.equals(that.client)) return false;
        if (!staffMember.equals(that.staffMember)) return false;
        return appointmentMeetings.equals(that.appointmentMeetings);
    }

    @Override
    public int hashCode() {
        int result = day.hashCode();
        result = 31 * result + startTime.hashCode();
        result = 31 * result + endTime.hashCode();
        result = 31 * result + client.hashCode();
        result = 31 * result + staffMember.hashCode();
        result = 31 * result + appointmentMeetings.hashCode();
        return result;
    }
}
