package TM470Project.Controller;

import TM470Project.Model.*;
import TM470Project.Repositories.ClientRepository;
import TM470Project.Repositories.StaffRepository;
import org.jetbrains.annotations.Contract;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import static TM470Project.Controller.CharityController.getLoggedInID;
import static TM470Project.Controller.CharityController.getUserName;

@RequestMapping("/Client")
@RestController
public class ClientController {

    private final ClientRepository clients;
    private final StaffRepository staffMembers;

    @Contract(pure = true)
    @Autowired
    ClientController(ClientRepository clients, StaffRepository staffMember) {
        this.clients = clients;
        this.staffMembers = staffMember;
    }

    /**
     * Find a client registered in charity.
     *
     * @param nationalHealthServiceNumber The client's NHS Number
     * @return return the found client object
     * @throws NoSuchElementException throws exception if not client is found.
     */
    private Client findClient(long nationalHealthServiceNumber) throws NoSuchElementException {
        return clients.findClientByNationalHealthServiceNumber(nationalHealthServiceNumber).orElseThrow
                (() -> new NoSuchElementException("No client matching the provided national health service number found."));
    }

    /**
     * Create a client object.
     *
     * @param firstName                   The client's first name.
     * @param lastName                    The client's last name.
     * @param sex                         The client's sex.
     * @param dateOfBirth                 The client's date of birth.
     * @param generalCondition            The client's general condition.
     * @param nextOfKin                   The client's next of kin.
     * @param nextOfKinNumber             The client's next of kins phone number.
     * @param diagnosis                   The client's diagnosis if available.
     * @param nationalHealthServiceNumber The client's NHS Number.
     */
    @CrossOrigin
    @RequestMapping(value = "/registerClient", method = RequestMethod.POST)
    public String registerClient(@RequestParam String firstName, String lastName, Sex sex, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth,
                               AreaOfExperience generalCondition, String nextOfKin, Long nextOfKinNumber, String diagnosis,
                               Long nationalHealthServiceNumber, String password) throws IllegalArgumentException {
        try {
            this.findClient(nationalHealthServiceNumber);
            throw new IllegalArgumentException("Client already exists!");
        } catch (NoSuchElementException e) {
            String username = getUserName(firstName, lastName, clients, staffMembers);
            clients.save(Client.createClient(firstName, lastName, sex, dateOfBirth, generalCondition, nextOfKin, nextOfKinNumber, diagnosis, nationalHealthServiceNumber, username, password));
            return username;
        }

    }

    /**
     * update a client object.
     *
     * @param lastName                    The client's last name.
     * @param nextOfKin                   The client's next of kin.
     * @param nextOfKinNumber             The client's next of kins phone number.
     * @param diagnosis                   The client's diagnosis if available.
     * @param nationalHealthServiceNumber The client's NHS Number.
     */
    @CrossOrigin
    @RequestMapping(value = "/updateClient", method = RequestMethod.POST)
    public void updateClient(String lastName, String nextOfKin, Long nextOfKinNumber, String diagnosis, int nationalHealthServiceNumber) throws IllegalArgumentException {

        Client c = clients.findClientByNationalHealthServiceNumber(nationalHealthServiceNumber).get();
        c.setLastName(lastName);
        c.setNextOfKin(nextOfKin);
        c.setNextOfKinNumber(nextOfKinNumber);
        c.setDiagnosis(diagnosis);

        clients.save(c);
    }

    @RequestMapping(value = "/getClients", method = RequestMethod.GET, produces = "application/json")
    List<Client> getClients() {
        return new ArrayList<>(clients.findAll());
    }

    /**
     * Remove a Client from charity
     *
     * @param nationalHealthServiceNumber the client's national insurance number.
     */
    @CrossOrigin
    @RequestMapping(value = "/removeClient", method = RequestMethod.DELETE)
    public void removeClient(Long nationalHealthServiceNumber) {
        if (!this.findClient(nationalHealthServiceNumber).hasAppointment() && this.findClient(nationalHealthServiceNumber).getCurrentSupportedHouseObject() == null) {
            clients.delete(this.findClient(nationalHealthServiceNumber));
        } else
            throw new IllegalArgumentException("the client is assigned to a supported house or has appointments.");
    }

    @CrossOrigin
    @RequestMapping(value = "/createNote", method = RequestMethod.POST)
    public void createNote(Long nationalHealthServiceNumber,String note, int priority) {
        Long ID = getLoggedInID();
        Client c = clients.findClientByNationalHealthServiceNumber(nationalHealthServiceNumber).orElseThrow
            (() -> new NoSuchElementException("No staff member matching the provided national insurance number has been located."));
        c.createNote(note,priority);
        c.getNote(note).hasBeenReadyBy(ID);
        clients.save(c);
    }

    @CrossOrigin
    @RequestMapping(value = "/noteHasBeenReadBy", method = RequestMethod.POST)
    public void noteHasBeenReadBy(Long nationalHealthServiceNumber,String note) {
        Long ID = getLoggedInID();
        Client c = clients.findClientByNationalHealthServiceNumber(nationalHealthServiceNumber).orElseThrow
                (() -> new NoSuchElementException("No staff member matching the provided national insurance number has been located."));
        c.getNote(note).hasBeenReadyBy(ID);
        clients.save(c);
    }
}
