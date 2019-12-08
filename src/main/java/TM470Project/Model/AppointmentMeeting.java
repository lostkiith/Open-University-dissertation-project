package TM470Project.Model;

import lombok.Data;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentMeeting {

    private LocalTime timeStarted;
    private LocalTime timeFinished;
    private String Location;
    private String notes;
    private LocalDate Date;
    private String clientSignature;
    private Boolean cancelled;

    @Contract(pure = true)
    private AppointmentMeeting(LocalTime timeStarted, LocalTime timeFinished, String location, String notes, LocalDate date, String clientSignature, Boolean cancelled) {
        this.timeStarted = timeStarted;
        this.timeFinished = timeFinished;
        Location = location;
        this.notes = notes;
        Date = date;
        this.clientSignature = clientSignature;
        this.cancelled = cancelled;
    }

    @Contract(pure = true)
    public AppointmentMeeting() {
    }

    /**
     * create an appointment meeting object
     * @param timeStarted       the time the appointment started.
     * @param timeFinished      the time the appointment finished.
     * @param location          the location of the appointment.
     * @param notes             any notes about the appointment.
     * @param date              the date of the appointment.
     * @param clientSignature   the client's signature
     * @return                  the appointment meeting object.
     */
    @NotNull
    @Contract(value = "_, _, _, _, _, _, _ -> new", pure = true)
    static AppointmentMeeting createAppointmentMeeting(LocalTime timeStarted, LocalTime timeFinished, String location, String notes, LocalDate date, String clientSignature, Boolean cancelled) {
        return new AppointmentMeeting(timeStarted, timeFinished, location, notes, date, clientSignature,cancelled);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AppointmentMeeting)) return false;

        AppointmentMeeting that = (AppointmentMeeting) o;

        if (!timeStarted.equals(that.timeStarted)) return false;
        if (!timeFinished.equals(that.timeFinished)) return false;
        if (!Location.equals(that.Location)) return false;
        if (!notes.equals(that.notes)) return false;
        if (!Date.equals(that.Date)) return false;
        return clientSignature.equals(that.clientSignature);
    }

    @Override
    public int hashCode() {
        int result = timeStarted.hashCode();
        result = 31 * result + timeFinished.hashCode();
        result = 31 * result + Location.hashCode();
        result = 31 * result + notes.hashCode();
        result = 31 * result + Date.hashCode();
        result = 31 * result + clientSignature.hashCode();
        return result;
    }
}
