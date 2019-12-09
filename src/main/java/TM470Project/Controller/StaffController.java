package TM470Project.Controller;

import TM470Project.Model.*;
import TM470Project.Repositories.ClientRepository;
import TM470Project.Repositories.StaffRepository;
import org.jetbrains.annotations.Contract;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import static TM470Project.Controller.CharityController.getUserName;

@RequestMapping("/Staff")
@RestController
public class StaffController {
    private final StaffRepository staffMembers;
    private final ClientRepository clients;

    @Contract(pure = true)
    @Autowired
    public StaffController(StaffRepository staffMembers, ClientRepository clients) {
        this.staffMembers = staffMembers;
        this.clients = clients;
    }

    /**
     * Creates a staff member with the responsibility of support staff or management.
     *
     * @param firstName         The staff member's first name.
     * @param lastName          The staff member's last name.
     * @param sex               The staff member's sex.
     * @param dateOfBirth       The staff member's date of birth.
     * @param addressFirstLine  The first line of the staff members address.
     * @param addressSecondLine The second line of the staff members address.
     * @param country           The county the staff member lives in.
     * @param town              The town the staff member lives in.
     * @param postCode          The staff member's postcode.
     * @param ninNumber         The staff member's national insurance number..
     * @param areaOfExperience  The staff member's area of experience.
     * @param manager           boolean if the staff member is a manager.
     */
    @RequestMapping(value = "/registerStaffMember", method = RequestMethod.POST)
    public String registerStaffMember(String firstName, String lastName, Sex sex, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dateOfBirth, String addressFirstLine, String addressSecondLine, String country, String town, String postCode,
                                    Long ninNumber, AreaOfExperience areaOfExperience, Boolean manager, String password) {
        try {
            this.findStaffMember(ninNumber);
            throw new IllegalArgumentException("The staff member already exists!");
        } catch (NoSuchElementException e) {
            String username = getUserName(firstName, lastName, clients, staffMembers);
            Address a1 = Address.createAddress(addressFirstLine, addressSecondLine, country, town, postCode);
            if (manager) {
                Staff m = Manager.createManager(firstName, lastName, sex, dateOfBirth, a1, ninNumber, areaOfExperience, username, password);
                staffMembers.save(m);
                return username;
            } else {
                Staff ssm = SupportStaffMember.createSupportStaffMember(firstName, lastName, sex, dateOfBirth, a1, ninNumber, areaOfExperience, username, password);
                staffMembers.save(ssm);
                return username;
            }
        }
    }

    /**
     * update a staff member's details.
     *
     * @param lastName          The staff member's last name.
     * @param addressFirstLine  The first line of the staff members address.
     * @param addressSecondLine The second line of the staff members address.
     * @param country           The county the staff member lives in.
     * @param town              The town the staff member lives in.
     * @param postCode          The staff member's postcode.
     * @param ninNumber         The staff member's national insurance number.
     */
    @RequestMapping(value = "/updateStaffMember", method = RequestMethod.POST)
    public void updateStaffMember(String lastName, String addressFirstLine, String addressSecondLine, String country, String town, String postCode, Long ninNumber) {

        Staff s = staffMembers.findByNinNumber(ninNumber).orElseThrow
                (() -> new NoSuchElementException("No Staff member matching the provided National Insurance number found."));
        s.setLastName(lastName);
        Address a = Address.createAddress(addressFirstLine,addressSecondLine,country,town,postCode);
        s.setAddress(a);
        staffMembers.save(s);
    }

    /**
     * Remove a staff member from charity
     *
     * @param ninNumber the staff member's national insurance number.
     */
    @RequestMapping(value = "/deleteStaffMember", method = RequestMethod.DELETE)
    public void removeStaffMember(long ninNumber) {
        Staff sm1;
        int ID = 0;
        //check to see if the Staff object is a manager or support staff instance.
        if (this.findStaffMember(ninNumber) instanceof SupportStaffMember) {
            //check if the support staff member has any appointments.
            if (!((SupportStaffMember) this.findStaffMember(ninNumber)).hasAppointment()) {
                sm1 = findStaffMember(ninNumber);
                staffMembers.delete(sm1);
            } else
                throw new IllegalArgumentException("the Support Staff Member currently has appointments.");
        } else {
            sm1 = findStaffMember(ninNumber);
            staffMembers.delete(sm1);
        }
    }

    /**
     * Find a staff member registered in charity.
     *
     * @param ninNumber the staff member's national insurance number.
     * @return return the staff object.
     * @throws NoSuchElementException thrown if their is not such staff object.
     */
    @RequestMapping(value = "/findStaffMemberByNinNumber", method = RequestMethod.GET, produces = "application/json")
    private Staff findStaffMember(long ninNumber) throws NoSuchElementException {
        return staffMembers.findByNinNumber(ninNumber).orElseThrow
                (() -> new NoSuchElementException("No Staff member matching the provided National Insurance number found."));
    }

    /**
     * returns a collection of all staff members objects.
     *
     * @return A ArrayList of staff objects.
     */
    @RequestMapping(value = "/getStaffMembers", method = RequestMethod.GET, produces = "application/json")
    List<SupportStaffMember> getStaffMembers() {
        List<SupportStaffMember> returnStaff = new ArrayList<>();
        for (Staff sm : staffMembers.findAll()) {
            if (sm instanceof SupportStaffMember) {
                returnStaff.add((SupportStaffMember) sm);
            }
        }
        return returnStaff;
    }

    /**
     * returns a collection of all Manager objects.
     *
     * @return A ArrayList of Manager objects.
     */
    @RequestMapping(value = "/getStaffManagers", method = RequestMethod.GET, produces = "application/json")
    List<Manager> getStaffManagers() {
        List<Manager> returnStaff = new ArrayList<>();
        for (Staff sm : staffMembers.findAll()) {
            if (sm instanceof Manager) {
                returnStaff.add((Manager) sm);
            }
        }
        return returnStaff;
    }
}
