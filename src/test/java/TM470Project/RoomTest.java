package TM470Project;

import TM470Project.Model.*;
import org.junit.Test;

import java.time.LocalDate;
import java.util.Calendar;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class RoomTest {

    @Test
    public void getOccupant() {
        SupportedHouse sh1 = SupportedHouse.createSupportedHouse("Apple House", Sex.Female, AreaOfExperience.General,
                Address.createAddress("2nd Street", "Appleton", "England", "Bristol", "BS153EZ"), 4);
        Client c1 = Client.createClient("Lise", "Simon", Sex.Female,
                LocalDate.of(1970, Calendar.SEPTEMBER, 28), AreaOfExperience.General, "Tim", (long)9598485, "Not Specific",
                (long)34342352, "LiseSimon","client" );
        Client c2 = Client.createClient("Clare", "Tee", Sex.Female,
                LocalDate.of(1975, Calendar.SEPTEMBER, 28), AreaOfExperience.General, "Mike", (long)9598465, "Not Specific",
                (long)15168756, "ClareTee","client");

        sh1.registerOccupant(c1);
        sh1.registerOccupant(c2);
        assertTrue(sh1.findOccupant(c1));

    }

    @Test
    public void setOccupant() {
        SupportedHouse sh1 = SupportedHouse.createSupportedHouse("Cider House", Sex.Male, AreaOfExperience.General,
                Address.createAddress("2nd Street", "Appleton", "England", "Bristol", "BS153EZ"), 4);
        Client c1 = Client.createClient("Sam", "Simon", Sex.Male,
                LocalDate.of(1970, Calendar.SEPTEMBER, 28), AreaOfExperience.General, "Tim", (long)9598485, "Not Specific",
                (long)8546875, "LiseSimon","client" );
        Client c2 = Client.createClient("Mike", "Tee", Sex.Male,
                LocalDate.of(1975, Calendar.SEPTEMBER, 28), AreaOfExperience.General, "lise", (long)9598465, "Not Specific",
                (long)48454678, "MikeTee","client");

        sh1.registerOccupant(c1);
        sh1.registerOccupant(c2);
        assertTrue(sh1.findOccupant(c1));
        assertTrue(sh1.findOccupant(c2));
    }

    @Test
    public void getNumber() {
        SupportedHouse sh1 = SupportedHouse.createSupportedHouse("Lime House", Sex.Male, AreaOfExperience.General,
                Address.createAddress("2nd Street", "Appleton", "England", "Bristol", "BS153EZ"), 4);
        Client c1 = Client.createClient("Paul", "Simon", Sex.Male,
                LocalDate.of(1970, Calendar.SEPTEMBER, 28), AreaOfExperience.General, "Tim", (long)9598485, "Not Specific",
                (long)21351154, "LiseSimon","client" );
        Client c2 = Client.createClient("John", "Tee", Sex.Male,
                LocalDate.of(1975, Calendar.SEPTEMBER, 28), AreaOfExperience.General, "lise", (long)9598465, "Not Specific",
                (long)20012511, "MikeTee","client");

        sh1.registerOccupant(c1);
        sh1.registerOccupant(c2);
        assertEquals(1, sh1.findOccupantRoom(c1));
        assertEquals(2, sh1.findOccupantRoom(c2));
    }
}