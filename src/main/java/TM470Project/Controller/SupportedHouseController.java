package TM470Project.Controller;

import TM470Project.Model.*;
import TM470Project.Repositories.SupportedHouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.NoSuchElementException;

@RequestMapping("/SupportedHouse")
@RestController
public class SupportedHouseController {

    private final SupportedHouseRepository supportedHouses;

    @Autowired
    public SupportedHouseController(SupportedHouseRepository supportedHouses) {
        this.supportedHouses = supportedHouses;
    }

    /**
     * create a supported house object and add it to charity.
     *
     * @param houseName         The name of the supported house.
     * @param gender            The gender of the supported house.
     * @param specificCondition The specific condition of the supported house.
     * @param addressFirstLine  The first line of the address for the supported house.
     * @param addressSecondLine The second line of the address for the supported house.
     * @param country           The county the supported house is in.
     * @param town              The town the supported house is in.
     * @param postCode          The postcode for the supported house.
     * @param roomNumber        the number of rooms in the supported house.
     */
    @RequestMapping(value = "/registerSupportedHouse", method = RequestMethod.POST, produces = "application/json")
    public void registerSupportedHouse(String houseName, Sex gender, AreaOfExperience specificCondition, String addressFirstLine, String addressSecondLine, String country,
                                       String town, String postCode, int roomNumber) {
        if (roomNumber == 0)
        {
            throw new IllegalArgumentException("A supported house must have at lest one room.");
        }
        if (!this.doesSupportedHouseExist(houseName)) {
            supportedHouses.save(SupportedHouse.createSupportedHouse(houseName, gender, specificCondition, Address.createAddress(addressFirstLine, addressSecondLine, country,
                    town, postCode), roomNumber));
        } else
            throw new IllegalArgumentException("A supported house with the same name '" + houseName + "' and postcode '" + postCode + "' already exist!");
    }

    /**
     * removes a supported house if it does not have an assigned clients.
     *
     * @param houseName The house name of the supported house to remove.
     */
    @RequestMapping(value = "/removeSupportedHouse", method = RequestMethod.DELETE)
    public void removeSupportedHouse(String houseName) {
        SupportedHouse sh = this.findSupportedHouse(houseName);
        if (sh.availableRooms().size() == sh.getRooms().size()) {
            this.supportedHouses.delete(sh);
        } else
            throw new IllegalArgumentException("The supported house currently has clients assigned to it.");
    }

    /**
     * found a supported house by its house name and postcode.
     *
     * @param houseName The house name of the supported house.
     * @return the supported house object that matches the house name and postcode.
     */
    @RequestMapping(value = "/findSupportedHouse", method = RequestMethod.GET, produces = "application/json")
    private SupportedHouse findSupportedHouse(String houseName) {
        return supportedHouses.findSupportedHouseByHouseName(houseName).orElseThrow(() -> new NoSuchElementException("No such Supported House exists!"));
    }

    /**
     * Find a supported house registered in charity.
     *
     * @param houseName the name of the supported house.
     * @return true if a matching supported house is found otherwise false.
     */
    private boolean doesSupportedHouseExist(String houseName) {
        for (SupportedHouse sh : supportedHouses.findAll())
            if (sh.getHouseName().equalsIgnoreCase(houseName))
                return true;
        return false;
    }
}
