package TM470Project.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedList;

/**
 * Represents an Staff member with the responsibility of supporting clients.
 * @author Luke Daniels.
 */
//FIXED LAZY = true

@EqualsAndHashCode(callSuper = true)
@Document(collection="staff")
@Data
public class SupportStaffMember extends Staff implements AppointmentManager {
    @JsonIgnore
    private LinkedList<Appointment> appointments;

    private SupportStaffMember(@NotNull String firstName,@NotNull String lastName,@NotNull Sex sex,@NotNull LocalDate dateOfBirth,@NotNull Address address,@NotNull Long ninNumber,
                               @NotNull AreaOfExperience areaOfExperience,@NotNull String username,@NotNull String password) {
        super(firstName, lastName, sex, dateOfBirth, address, ninNumber, areaOfExperience, username, password);
        appointments = new LinkedList<>();
    }

    /**
     * Creates an Support Staff member.
     *
     * @param firstName        The staff members first name.
     * @param lastName         The staff members last name.
     * @param sex              The staff members sex.
     * @param dateOfBirth      The staff members date of birth.
     * @param address          The staff members address.
     * @param ninNumber        The staff members insurance number.
     * @param areaOfExperience The staff members area of experience.
     */
    @Contract("_, _, _, _, _, _, _, _, _ -> new")
    @NotNull
    public static SupportStaffMember createSupportStaffMember(String firstName, String lastName, Sex sex, LocalDate dateOfBirth, Address address,
                                                       Long ninNumber, AreaOfExperience areaOfExperience, String username, String password) {
        return new SupportStaffMember(firstName, lastName, sex, dateOfBirth, address, ninNumber, areaOfExperience, username, password);
    }

    SupportStaffMember() {
    }

    /**
     * set an Appointment object
     * @param day       The day that the appointment is meant to be set.
     * @param startTime The start time that the appointment is to begin.
     * @param endTime   The end time that the appointment is meant to end.
     */
    @Override
    public void setAppointment(DayOfWeek day, LocalTime startTime, LocalTime endTime, Client client, SupportStaffMember staff) {
        this.appointments.add(Appointment.createAppointment(day, startTime, endTime, client, this));
    }

    /**
     * returns a linklist of the support members appointments.
     * @return the LinkedList of appointment objects.
     */
    public LinkedList<Appointment> getAppointments() {
        return appointments;
    }
}
