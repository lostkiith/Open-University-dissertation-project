package TM470Project;

import TM470Project.Model.*;
import org.junit.Test;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Calendar;

import static org.junit.Assert.assertEquals;

public class AppointmentTest {
    @Test
    public void createAppointmentMeeting() {

        Client c1 = Client.createClient("Tim", "Arron", Sex.Male,  LocalDate.of(1981, Calendar.SEPTEMBER, 28), AreaOfExperience.Forensic,
                "Markus", (long)60534945, "not determined", (long)1578461, "TimArron", "client");

        SupportStaffMember sm1 = SupportStaffMember.createSupportStaffMember("John", "List", Sex.Male,  LocalDate.of(1981, Calendar.SEPTEMBER, 28),
                Address.createAddress("Cake road", "rocky", "England", "London", "bs3 5dx"),
                (long)484648675, AreaOfExperience.Forensic, "JohnList", "staff" );

        Appointment app1 = Appointment.createAppointment(DayOfWeek.TUESDAY, LocalTime.of(13,00), LocalTime.of(14,00), c1, sm1);
        c1.setAppointment(app1);

        app1.createAppointmentMeeting(LocalTime.of(13, 10, 0)
                , LocalTime.of(15, 10, 0), "Apple House", "no problems."
                , LocalDate.of(2019, 8, 22), "Sam", false);

        AppointmentMeeting am1 = app1.getAppointmentMeeting(LocalDate.of(2019, 8, 22));

        //check that the variables of the created AppointmentMeeting meet the pass parameters.
        assertEquals(LocalTime.of(13, 10, 0), am1.getTimeStarted());
        assertEquals(LocalTime.of(15, 10, 0), am1.getTimeFinished());
        assertEquals(LocalDate.of(2019, 8, 22), am1.getDate());
        assertEquals("Apple House", am1.getLocation());
        assertEquals("no problems.", am1.getNotes());
        assertEquals("Sam", am1.getClientSignature());
    }
}