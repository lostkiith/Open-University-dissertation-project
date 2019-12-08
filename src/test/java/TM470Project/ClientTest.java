package TM470Project;

import TM470Project.Controller.CharityController;
import TM470Project.Controller.ClientController;
import TM470Project.Controller.StaffController;
import TM470Project.Model.*;
import TM470Project.Repositories.ClientRepository;
import TM470Project.Repositories.StaffRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Calendar;
import java.util.NoSuchElementException;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ClientTest {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientController clientController;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private StaffController staffController;

    @Autowired
    private CharityController charity;

    @Test
    public void registerClient() {
        clientController.registerClient("John", "List", Sex.Male,  LocalDate.of(1981, Calendar.SEPTEMBER, 28), AreaOfExperience.Forensic,
                "Markus", (long)60534945, "not determined", (long)1578461, "client");
        clientController.registerClient("Cary", "Dee", Sex.Female,  LocalDate.of(1984, Calendar.SEPTEMBER, 28), AreaOfExperience.General,
                "Lee", (long)60534445, "not determined", (long)8754165, "client" );
        //test adding client objects to charity.
        assertTrue(clientRepository.findClientByNationalHealthServiceNumber(1578461).isPresent());
        assertTrue(clientRepository.findClientByNationalHealthServiceNumber(8754165).isPresent());

        clientController.removeClient((long)1578461);
        clientController.removeClient((long)8754165);
    }

    @Test
    public void removeClient() {
        clientController.registerClient("John", "List", Sex.Male,  LocalDate.of(1981, Calendar.SEPTEMBER, 28), AreaOfExperience.Forensic,
                "Markus", (long)60534945, "not determined", (long)2254897,   "client");
        clientController.registerClient("Cary", "Dee", Sex.Female,  LocalDate.of(1984, Calendar.SEPTEMBER, 28), AreaOfExperience.General,
                "Lee", (long)60534445, "not determined", (long)9864518, "client" );

        //test adding client objects to charity.
        assertTrue(clientRepository.findClientByNationalHealthServiceNumber(2254897).isPresent());
        clientController.removeClient((long)2254897);
        assertFalse(clientRepository.findClientByNationalHealthServiceNumber(2254897).isPresent());

        clientController.removeClient((long)9864518);

    }

    @Test
    public void doesClientExist() {
        clientController.registerClient("John", "List", Sex.Male,  LocalDate.of(1981, 7, 28), AreaOfExperience.Forensic,
                "Markus", (long)60534945, "not determined", (long)4856487,   "client");
        clientController.registerClient("Cary", "Dee", Sex.Female,  LocalDate.of(1984, 7, 28), AreaOfExperience.General,
                "Lee", (long)60534445, "not determined", (long)36548778, "client");
        //test adding client objects to charity.
        assertTrue(clientRepository.findClientByNationalHealthServiceNumber(4856487).isPresent());
        assertTrue(clientRepository.findClientByNationalHealthServiceNumber(36548778).isPresent());
        clientController.removeClient((long)4856487);
        clientController.removeClient((long)36548778);

    }

    @Test
    public void findClient() {

        clientController.registerClient("John", "List", Sex.Male,  LocalDate.of(1981, Calendar.SEPTEMBER, 28), AreaOfExperience.Forensic,
                "Markus", (long)60534945, "not determined", (long)4785136,   "client");
        clientController.registerClient("Cary", "Dee", Sex.Female,  LocalDate.of(1984, Calendar.SEPTEMBER, 28), AreaOfExperience.General,
                "Lee", (long)60534445, "not determined", (long)24598752, "client");
        //test adding client objects to charity.
        Long lo = (long)4785136;
        assertEquals(lo, clientRepository.findClientByNationalHealthServiceNumber(4785136).get().getNationalHealthServiceNumber());
        lo = (long)24598752;
        assertEquals(lo, clientRepository.findClientByNationalHealthServiceNumber(24598752).get().getNationalHealthServiceNumber());

        clientController.removeClient((long)4785136);
        clientController.removeClient((long)24598752);

    }

    @Test
    public void createAppointment() {

        Client c1;
        SupportStaffMember sm1;

        clientController.registerClient("John", "List", Sex.Male,  LocalDate.of(1981, Calendar.SEPTEMBER, 28), AreaOfExperience.Forensic,
                "Markus", (long)60534945, "not determined", (long)4785136,   "client");
        staffController.registerStaffMember("Tim", "Smith", Sex.Male,  LocalDate.of(1970, Calendar.SEPTEMBER, 28),
                "60 Line Street", "Fishpin", "England", "Bristol", "BS156AD", (long)4549854,
                AreaOfExperience.General, false,  "staff");

        charity.createAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0),4785136
                ,4549854);


        //check that both the client and support staff member have the new appointment.
        try {
            sm1 = (SupportStaffMember) staffRepository.findByNinNumber(4549854).get();
            sm1.getAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0));

            c1 = clientRepository.findClientByNationalHealthServiceNumber(4785136).get();
            c1.getAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0));
        } catch (NoSuchElementException e) {
            System.out.println(e.toString());
        }

        charity.removeAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0),4785136
                ,4549854);

        clientRepository.delete(clientRepository.findClientByNationalHealthServiceNumber(4785136).get());
        staffRepository.delete(staffRepository.findByNinNumber(4549854).get());
    }

    @Test
    public void removeAppointment() {
        Client c1;
        SupportStaffMember sm1;

        clientController.registerClient("Sam", "List", Sex.Male,  LocalDate.of(1981, Calendar.SEPTEMBER, 28), AreaOfExperience.Forensic,
                "Markus", (long)60534945, "not determined", (long)8875484,  "client");
        staffController.registerStaffMember("Martin", "Smith", Sex.Male,  LocalDate.of(1970, Calendar.SEPTEMBER, 28),
                "60 Line Street", "Fishpin", "England", "Bristol", "BS156AD", (long)65845748,
                AreaOfExperience.General, false,  "staff");


        charity.createAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0),8875484
                ,65845748);

        //check that both the client and support staff member have the new appointment.
        try {
            sm1 = (SupportStaffMember) staffRepository.findByNinNumber(65845748).get();
            sm1.getAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0));
            c1 = clientRepository.findClientByNationalHealthServiceNumber(8875484).get();
            c1.getAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0));
            clientRepository.save(c1);
            staffRepository.save(sm1);
        } catch (NoSuchElementException e) {
            System.out.println(e.toString());
        }

        charity.removeAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0),8875484
                ,65845748);


        try {
            sm1 = (SupportStaffMember) staffRepository.findByNinNumber(65845748).get();
            sm1.getAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0));
            fail("expected an NoSuchElementException error");
        } catch (NoSuchElementException e) {
            System.out.println(e.toString());
        }

        try {
            c1 = clientRepository.findClientByNationalHealthServiceNumber(8875484).get();
            c1.getAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0));
            fail("expected an NoSuchElementException error");
        } catch (NoSuchElementException e) {
            System.out.println(e.toString());
        }

        clientController.removeClient((long)8875484);
        staffController.removeStaffMember(65845748);

    }


}