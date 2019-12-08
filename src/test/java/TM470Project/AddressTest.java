package TM470Project;

import TM470Project.Model.Address;
import org.junit.Test;
import static org.junit.Assert.*;

public class AddressTest {
    private static final Address ad = Address.createAddress("72 Line Street",
            "Fishpin", "England", "Bristol", "BS156AD");
    private static final Address ad2 = Address.createAddress("72 Line Street",
            "Fishpin", "England", "Bristol", "BS156AD");

    @Test
    public void equals() {
        //test two Address Objects with the same variables.
        assertEquals(ad, ad2);
        Address ad3 = Address.createAddress("71 Line Street",
                "Fishpin", "England", "Bristol", "BS156AD");
        //test two Address objects with different addressFirstLine "71 Line Street" vs "72 Line Street".
        assertNotEquals(ad, ad3);
        ad3 = Address.createAddress("72 Line Street",
                "fish", "England", "Bristol", "BS156AD");
        //test two Address objects with different addressSecondLine "Fishpin" vs "Fish".
        assertNotEquals(ad, ad3);
        ad3 = Address.createAddress("72 Line Street",
                "Fishpin", "Ireland", "Bristol", "BS156AD");
        //test two Address objects with different country "England" vs "Ireland".
        assertNotEquals(ad, ad3);
        ad3 = Address.createAddress("72 Line Street",
                "Fishpin", "England", "london", "BS156AD");
        //test two Address objects with different town variables "Bristol" vs "london".
        assertNotEquals(ad, ad3);
        assertNotEquals(ad, ad3);
        ad3 = Address.createAddress("72 Line Street",
                "Fishpin", "England", "Bristol", "BS56AD");
        //test two Address objects with different town variables "BS156AD" vs "BS56AD".
        assertNotEquals(ad, ad3);
    }
}