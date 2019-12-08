package TM470Project.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.NoSuchElementException;

/**
 * Represents an client.
 * @author Luke Daniels.
 */
@Data
//FIXED LAZY = true

@Document(collection="client")
public class Client extends Person implements AppointmentManager {

    private AreaOfExperience generalCondition;
    private String nextOfKin;
    private Long nextOfKinNumber;
    private String Diagnosis;
    @Id
    private Long nationalHealthServiceNumber;
    @DBRef(lazy = true)
    private SupportedHouse currentSupportedHouse;
    @JsonIgnore
    private LinkedList<Appointment> appointments;
    private ArrayList<Note> notes;


    private Client(@NotNull String firstName,@NotNull String lastName,@NotNull Sex sex,@NotNull LocalDate dateOfBirth,
                   @NotNull AreaOfExperience generalCondition,  @NotNull String nextOfKin, @NotNull Long nextOfKinNumber,
                   @NotNull String diagnosis, @NotNull Long nationalHealthServiceNumber, String username,@NotNull String password) {
        super(firstName, lastName, sex, dateOfBirth, username, password);
        this.generalCondition = generalCondition;
        this.nextOfKin = nextOfKin;
        this.nextOfKinNumber = nextOfKinNumber;
        Diagnosis = diagnosis;
        this.nationalHealthServiceNumber = nationalHealthServiceNumber;
        appointments = new LinkedList<>();
        notes = new ArrayList<>();
    }

    /**
     * Create a client object.
     * @param firstName                   The client's first name.
     * @param lastName                    The client's last name.
     * @param sex                         The sex of the client.
     * @param dateOfBirth                 The client's date of birth.
     * @param generalCondition            The client's general Condition.
     * @param nextOfKin                   The client's next of kin.
     * @param diagnosis                   The client's diagnosis if available.
     * @param nationalHealthServiceNumber The client's NHS Number.
     * @return The client object.
     */
    @NotNull
    @Contract("_, _, _, _, _, _, _, _, _, _, _ -> new")
    public static Client createClient(String firstName, String lastName, Sex sex, LocalDate dateOfBirth,
                               AreaOfExperience generalCondition, String nextOfKin, Long nextOfKinNumber, String diagnosis,
                                Long nationalHealthServiceNumber, String username, String password) {
        return new Client(firstName, lastName, sex, dateOfBirth, generalCondition, nextOfKin, nextOfKinNumber, diagnosis, nationalHealthServiceNumber, username, password);
    }

    Client() {
    }

    /**
     * set an Appointment object
     * @param day       The day that the appointment is meant to be set.
     * @param startTime The start time that the appointment is to begin.
     * @param endTime   The end time that the appointment is meant to end.
     */
    @Override
    public void setAppointment(DayOfWeek day, LocalTime startTime, LocalTime endTime, Client client, SupportStaffMember staffMember) {
        this.appointments.add(Appointment.createAppointment(day, startTime, endTime, this, staffMember));
    }


    public LinkedList<Appointment> getAppointments() {
        return appointments;
    }

    /**
     * return the supported house instance if available.
     */
    public SupportedHouse getCurrentSupportedHouseObject() {
        return currentSupportedHouse;
    }

    /**
     * return the supported house instances house name.
     */
    String getCurrentSupportedHouse() { 
        return currentSupportedHouse != null ? currentSupportedHouse.getHouseName() : "no current supported house assigned.";
    }

    public void createNote(String note, int priority)
    {
        notes.add(Note.createNote(note,priority));
    }

    public Note getNote(String noteToFind) {
        for (Note n : notes)
        {
            if (n.getNote().equals(noteToFind))
            {
                return n;
            }
        }
        throw new NoSuchElementException("No match Message found");
    }

    @Contract(value = "null -> false", pure = true)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Client)) return false;
        if (!super.equals(o)) return false;

        Client client = (Client) o;

        return nationalHealthServiceNumber.equals(client.nationalHealthServiceNumber);
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + nationalHealthServiceNumber.hashCode();
        return result;
    }
}



