package TM470Project;

import TM470Project.Controller.CharityController;
import TM470Project.Controller.ClientController;
import TM470Project.Controller.StaffController;
import TM470Project.Controller.SupportedHouseController;
import TM470Project.Model.*;
import TM470Project.Repositories.ClientRepository;
import TM470Project.Repositories.StaffRepository;
import TM470Project.Repositories.SupportedHouseRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CharityTest {

    @Autowired
    private SupportedHouseRepository supportedHouseRepository;

    @Autowired
    private SupportedHouseController supportedHouseController;

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
    public void createAppointmentAndRemove() {

        Client c1;
        SupportStaffMember sm1;
        Appointment app1;
        Appointment app2;

        clientController.registerClient("John", "List", Sex.Male,  LocalDate.of(1981, Calendar.SEPTEMBER, 28), AreaOfExperience.Forensic,
                "Markus", (long)60534945, "not determined", (long)4785136, "client");
        staffController.registerStaffMember("Tim", "Smith", Sex.Male,  LocalDate.of(1970, Calendar.SEPTEMBER, 28),
                "60 Line Street", "Fishpin", "England", "Bristol", "BS156AD", (long)4549854,
                AreaOfExperience.General, false,  "staff");

        charity.createAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0),4785136
                ,4549854);

        //check that both the client and support staff member have the new appointment.
        try {
            sm1 = (SupportStaffMember) staffRepository.findByNinNumber(4549854).get();
            app1 = sm1.getAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0));

            c1 = clientRepository.findClientByNationalHealthServiceNumber(4785136).get();
            app2 = c1.getAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0));

        } catch (NoSuchElementException e) {
            System.out.println(e.toString());
        }

        try {
            charity.createAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0),4785136
                    ,4549854);
            fail();
        } catch (IllegalArgumentException e) {
            System.out.println(e.toString());
        }

        //removing an appointment.
        charity.removeAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0),4785136
                ,4549854);

        //checking for appointment removal.
        try {
            sm1 = (SupportStaffMember) staffRepository.findByNinNumber(4549854).get();
            app1 = sm1.getAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0));


        } catch (NoSuchElementException e) {
            System.out.println(e.toString());
        }

        //checking for appointment removal.
        try {
            c1 = clientRepository.findClientByNationalHealthServiceNumber(4785136).get();
            app2 = c1.getAppointment(DayOfWeek.SATURDAY, LocalTime.of(14,0), LocalTime.of(15,0));

        } catch (NoSuchElementException e) {
            System.out.println(e.toString());
        }


        clientController.removeClient((long)4785136);
        staffController.removeStaffMember(4549854);

    }

    @Test
    public void registerClientInSupportedHouseAndRemove() {

        clientController.registerClient("John", "List", Sex.Male,  LocalDate.of(1981, Calendar.SEPTEMBER, 28), AreaOfExperience.Forensic,
                "Markus", (long)60534945, "not determined", (long)4785136,  "client");
        supportedHouseController.registerSupportedHouse("Grape House", Sex.Male, AreaOfExperience.Forensic,
                "2nd Street", "Appleton", "England", "Bristol", "BS253EZ", 3);

        //adding a client to a supported house.
        charity.registerClientInSupportedHouse("Grape House", 4785136);

        assertTrue(supportedHouseRepository.findSupportedHouseByHouseName("Grape House").get().
                    findOccupant(clientRepository.findClientByNationalHealthServiceNumber(4785136).get()));

        charity.removeClientFromSupportedHouse("Grape House", 4785136);

        assertFalse(supportedHouseRepository.findSupportedHouseByHouseName("Grape House").get().
                findOccupant(clientRepository.findClientByNationalHealthServiceNumber(4785136).get()));

        supportedHouseController.removeSupportedHouse("Grape House");
        clientController.removeClient((long)4785136);

    }

}