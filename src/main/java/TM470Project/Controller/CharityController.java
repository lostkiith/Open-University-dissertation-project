package TM470Project.Controller;

import TM470Project.Configuration.RequestUserDetails;
import TM470Project.Model.*;
import TM470Project.Repositories.ClientRepository;
import TM470Project.Repositories.StaffRepository;
import TM470Project.Repositories.SupportedHouseRepository;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * Represents the overall charity.
 *
 * @author Luke Daniels.
 */
@RestController
@RequestMapping("/Charity")
public class CharityController {

    private final StaffRepository staffMembers;
    private final ClientRepository clients;
    private final SupportedHouseRepository supportedHouses;

    @Contract(pure = true)
    @Autowired
    public CharityController(StaffRepository staffMembers, ClientRepository clients, SupportedHouseRepository supportedHouses) {
        this.staffMembers = staffMembers;
        this.clients = clients;
        this.supportedHouses = supportedHouses;
    }

    /**
     * register the client matching the NHS number to the supported house matching the house name.
     * throws a NoSuchElementException if the supported house or client cannot be found.
     *
     * @param houseName the house name to match.
     * @param NHSnumber the client NHS number to match.
     */
    @RequestMapping(value = "/registerClientInSupportedHouse", method = RequestMethod.POST)
    public void registerClientInSupportedHouse(String houseName, long NHSnumber) {
        Client c = this.clients.findClientByNationalHealthServiceNumber(NHSnumber).orElseThrow
                (() -> new NoSuchElementException("No client matching the provided national health service number found."));
        SupportedHouse sh = this.supportedHouses.findSupportedHouseByHouseName(houseName).orElseThrow(() -> new NoSuchElementException("No such Supported House exists!"));
        sh.registerOccupant(c);
        this.clients.save(c);
        this.supportedHouses.save(sh);
    }

    /**
     * remove the client matching the NHS number from the supported house matching the house name.
     * throws a NoSuchElementException if the supported house, client cannot be found or the client
     * is not registered in the supported house.
     *
     * @param houseName the house name to match.
     * @param NHSnumber the client NHS number to match.
     */
    @RequestMapping(value = "/removeClientFromSupportedHouse", method = RequestMethod.DELETE)
    public void removeClientFromSupportedHouse(String houseName, long NHSnumber) {
        Client c = this.clients.findClientByNationalHealthServiceNumber(NHSnumber).orElseThrow
                (() -> new NoSuchElementException("No client matching the provided national health service number found."));
        SupportedHouse sh = this.supportedHouses.findSupportedHouseByHouseName(houseName).orElseThrow(() -> new NoSuchElementException("No such Supported House exists!"));
        if (!sh.removeOccupant(c)) {
            throw new NoSuchElementException("The client " + c.getFirstName() + " " + c.getLastName() + " is not registered in the supported house " + sh.getHouseName());
        }
        this.clients.save(c);
        this.supportedHouses.save(sh);
    }

    /**
     * create an appointment between a client and a support staff member on a specific day and
     * at a specific time.
     *
     * @param day       The day of the appointment to add.
     * @param startTime The start time of the appointment to add..
     * @param endTime   The end time of the appointment to add..
     * @param NHSnumber the NHS number of the client.
     * @param ninNumber The National Insurance number of the staff member.
     *                  throws a NoSuchElementException if the client or staff member cannot be found.
     *                  throws a IllegalArgumentException if the client or support staff member is not free.
     */
    @RequestMapping(value = "/createAnAppointment", method = RequestMethod.POST)
    public void createAppointment(DayOfWeek day, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
                                  @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime, long NHSnumber, long ninNumber) {

        Client c1 = this.clients.findClientByNationalHealthServiceNumber(NHSnumber).orElseThrow
                (() -> new NoSuchElementException("No client matching the provided national health service number has been located."));
        SupportStaffMember sm1 = (SupportStaffMember) this.staffMembers.findByNinNumber(ninNumber).orElseThrow
                (() -> new NoSuchElementException("No staff member matching the provided national insurance number has been located."));

        if (!c1.checkFree(day, startTime, endTime)) {
            throw new IllegalArgumentException("The client " + c1.getFirstName() + " " + c1.getLastName() + " is not free.");
        } else if(!sm1.checkFree(day, startTime, endTime)){
                throw new IllegalArgumentException("The client " + c1.getFirstName() + " " + c1.getLastName() +
                        " and staff member " + sm1.getFirstName() + " " + sm1.getLastName() + " are not free.");
        }else {
            Appointment app1 = Appointment.createAppointment(day, startTime, endTime, c1, sm1);
            c1.setAppointment(app1);
            sm1.setAppointment(app1);
            clients.save(c1);
            staffMembers.save(sm1);
        }
    }

    /**
     * Remove the Appointment from both the client and support staff member.
     *
     * @param day       The day of the appointment to remove.
     * @param startTime The start time of the appointment to remove.
     * @param endTime   The end time of the appointment to remove.
     * @param NHSnumber the NHS number of the client.
     * @param ninNumber The National Insurance number of the staff member.
     *                  throws a NoSuchElementException if the client or staff member cannot be found.
     */
    @RequestMapping(value = "/removeAnAppointment", method = RequestMethod.DELETE)
    public void removeAppointment(DayOfWeek day, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
                                  @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime, long NHSnumber, long ninNumber) {
        SupportStaffMember sm1 = (SupportStaffMember) this.staffMembers.findByNinNumber(ninNumber).orElseThrow
                (() -> new NoSuchElementException("No Staff member matching the provided National Insurance number found."));
        Client c1 = this.clients.findClientByNationalHealthServiceNumber(NHSnumber).orElseThrow
                (() -> new NoSuchElementException("No client matching the provided national health service number found."));
        sm1.removeAppointment(sm1.getAppointment(day, startTime, endTime));
        c1.removeAppointment(c1.getAppointment(day, startTime, endTime));
        clients.save(c1);
        staffMembers.save(sm1);
    }

    /**
     * return   a collection of all clients that are supported by the logged in staff member.
     * @return a HashSet of all clients supported by the staff member.
     */
    @RequestMapping(value = "/getSupportWorkersClients", method = RequestMethod.GET, produces = "application/json")
    private List<Client> getSupportWorkersClients() {
        List<Client> clientList = new ArrayList<>();
        Long ID;
        ID = getLoggedInID();

        SupportStaffMember sm1 = (SupportStaffMember) this.staffMembers.findByNinNumber(ID).orElseThrow
                (() -> new NoSuchElementException("No staff member matching the provided national insurance number has been located."));

        for (Appointment a : sm1.getAppointments()) {
            clientList.add(a.getClient());
        }

        return clientList.stream().distinct().collect(Collectors.toList());
    }

    /**
     * get all supported houses with free rooms.
     * @return a linkedlist with the available support houses.
     */
    @RequestMapping(value = "/getSupportedHouse", method = RequestMethod.GET, produces = "application/json")
    LinkedList<SupportedHouse> getSupportedHouse() {
        LinkedList<SupportedHouse> returnHouses = new LinkedList<>();
        for (SupportedHouse sh : supportedHouses.findAll())
        {
            if (sh.availableRooms().size() > 0)
            {
                returnHouses.add(sh);
            }
        }
        return returnHouses;
    }

    /**
     * get all supported houses with no assigned clients,
     * @return a linkedlist with the supported houses.
     */
    @RequestMapping(value = "/getAllUnassignedSupportedHouses", method = RequestMethod.GET, produces = "application/json")
    LinkedList<SupportedHouse> getAllUnassignedSupportedHouses() {
        LinkedList<SupportedHouse> returnHouses = new LinkedList<>();
        for (SupportedHouse sh : supportedHouses.findAll())
        {
            if (sh.availableRooms().size() == sh.getRooms().size())
            {
                returnHouses.add(sh);
            }
        }
        return returnHouses;
    }

    /**
     * get all supported houses that have room and match the specific sex and mental health conditions.
     * @param sex   the sex the supported houses must match.
     * @param aoe   the mental health conditions the supported house must match.
     * @return      a linked list of all matching supported houses or a empty list if no matches.
     */
    @RequestMapping(value = "/getSpecificSupportedHouse", method = RequestMethod.GET, produces = "application/json")
    LinkedList<SupportedHouse> getSpecificSupportedHouse(Sex sex, AreaOfExperience aoe) {
        LinkedList<SupportedHouse> returnHouses = new LinkedList<>();
        for (SupportedHouse sh : supportedHouses.findAll())
        {
            if (sh.availableRooms().size() > 0 && sh.getGender().equals(sex) && sh.getSpecificCondition().equals(aoe))
            {
                returnHouses.add(sh);
            }
        }
        return returnHouses;
    }

    /**
     * @return all appointments linked to the support worker.
     */
    @RequestMapping(value = "/getAppointments", method = RequestMethod.GET, produces = "application/json")
    Collection<Appointment> getAppointments() {
        Long ID;
        ID = getLoggedInID();
        String userRole = CharityController.getLoggedInRole();

        if (userRole.equals("ROLE_STAFF")) {
            SupportStaffMember sm1 = (SupportStaffMember) this.staffMembers.findByNinNumber(ID).orElseThrow
                    (() -> new NoSuchElementException("No staff member matching the provided national insurance number has been located."));
            return sm1.getAppointments();
        } else if (userRole.equals("ROLE_CLIENT")) {
            Client c1 = this.clients.findClientByNationalHealthServiceNumber(ID).orElseThrow
                    (() -> new NoSuchElementException("No staff member matching the provided national insurance number has been located."));
            HashSet<Appointment> app = new HashSet<>(c1.getAppointments());
            app.forEach(appointment -> appointment.getAppointmentMeetings().forEach(appointmentMeeting -> appointmentMeeting.setNotes("")));
            app.forEach(appointment -> appointment.getStaffMemberObject().setAddress(null));
            app.forEach(appointment -> appointment.getStaffMemberObject().setUsername(""));
             return app;
        }
        throw new NoSuchElementException("No matching appointments found!");
    }

    /**
     * get a list of appointments for a specific client or staff member
     *
     * @param ID the Nim or NHS Number of the staff member or client.
     * @return the list of appointments.
     */
    @RequestMapping(value = "/getAppointmentsFor", method = RequestMethod.GET, produces = "application/json")
    Collection<Appointment> getAppointmentsFor(Long ID) {

        if (this.staffMembers.findByNinNumber(ID).isPresent()) {
            SupportStaffMember sm1 = (SupportStaffMember) this.staffMembers.findByNinNumber(ID).get();
            return sm1.getAppointments();
        } else if (this.clients.findClientByNationalHealthServiceNumber(ID).isPresent()) {
            Client c1 = this.clients.findClientByNationalHealthServiceNumber(ID).get();
            return c1.getAppointments();
        } else {
            throw new NoSuchElementException("No Staff or Client has been located!");
        }
    }

    /**
     *  A collection of support staff members that match then needs of the supplied client.
     * @param clientNationalHealthServiceNumber the NHS number of the client to match.
     * @return  a LinkedList of staff members that match or a empty list if no matches
     */
    @RequestMapping(value = "/getAppropriateStaff", method = RequestMethod.GET, produces = "application/json")
    LinkedList<Staff> getAppropriateStaff(Long clientNationalHealthServiceNumber) {

        LinkedList<Staff> appropriateStaff = new LinkedList<>();
        Client c1 = this.clients.findClientByNationalHealthServiceNumber(clientNationalHealthServiceNumber).orElseThrow
                (() -> new NoSuchElementException("No Client matching the provided national Health Service Number has been located."));

        for (Staff sm : staffMembers.findAll())
        {
            if (sm instanceof SupportStaffMember)
            {
                if (sm.getAreaOfExperience().equals(c1.getGeneralCondition())){
                    appropriateStaff.add(sm);
                }
            }
        }
        return appropriateStaff;
    }

    /**
     * creates a appointment meeting between the logged in staff member and a supported client.
     * @param day                       the day of the appointment e.g. MONDAY.
     * @param appStartTime              the start time of the appointment.
     * @param appEndTime                the end time of the appointment.
     * @param appStarted                the time the appointment meeting started.
     * @param appEnded                  the time the appointment meeting finished.
     * @param location                  any location from the appointment meeting.
     * @param notes                     any notes from the appointment meeting.
     * @param date                      the date the appointment meeting was on
     * @param clientSignature           the clients signature.
     * @throws IllegalArgumentException thrown if an appointment meeting object already exists on the selected date.
     */
    @RequestMapping(value = "/createAppMeeting", method = RequestMethod.POST)
    void createAppMeeting(DayOfWeek day, @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime appStartTime,
                          @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime appEndTime, @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime appStarted,
                          @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime appEnded, String location, String notes,
                          @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date, String clientSignature, Boolean cancelled ) throws IllegalArgumentException {
        Long ID;
        ID = getLoggedInID();
        SupportStaffMember sm1 = (SupportStaffMember) this.staffMembers.findByNinNumber(ID).orElseThrow
                (() -> new NoSuchElementException("No staff member matching the provided national insurance number has been located."));
        //gets the appointment object or throws an error if not found.
        Appointment smApp = sm1.getAppointment(day,appStartTime,appEndTime);

        Client c = clients.findClientByNationalHealthServiceNumber(smApp.getClient().getNationalHealthServiceNumber()).orElseThrow
                (() -> new NoSuchElementException("No staff member matching the provided national insurance number has been located."));

        Appointment cApp = c.getAppointment(day,appStartTime,appEndTime);

        //check for am Appointment Meeting already existing.
        for (AppointmentMeeting appointmentMeeting : cApp.getAppointmentMeetings()) {
            if (appointmentMeeting.getDate().isEqual(date))
            {
                throw new IllegalArgumentException("Am Appointment Meeting already exists on the selected date.");
            }
        }
        //check the day of the date is the same as the day the appointment is on.
        if (!date.getDayOfWeek().equals(day))
        {
            throw new IllegalArgumentException("Day of appointment must be the same as the appointment date.");
        }
        else {
            cApp.createAppointmentMeeting(appStarted, appEnded, location, notes, date, clientSignature, cancelled);
            smApp.createAppointmentMeeting(appStarted, appEnded, location, notes, date, clientSignature, cancelled);
            staffMembers.save(sm1);
            clients.save(c);
        }
    }

    /**
     * check if the clients belonging to the signed logged in user have missed three or more appointments with a single staff member.
     * @return a LinkedList of the appointment that had been missed more than three times.
     */
    @RequestMapping(value = "/behavioralSignsMissedAppOneSup", method = RequestMethod.GET)
    LinkedList<Appointment> behavioralSignsMissedAppOneSup() {
        LinkedList<Appointment> clientsThatMissed = new LinkedList<>();
        List<Client> clientsApp = getSupportWorkersClients();
        List<AppointmentMeeting> appointmentMeetings = new ArrayList<>();
        int missAppointment = 0;

        for (Client c: clientsApp) {
            for (Appointment app: c.getAppointments()) {
                //appointmentMeetings = app.getAppointmentMeetings();
                appointmentMeetings.addAll(app.getAppointmentMeetings());

                if (appointmentMeetings.size() >= 3) {
                    appointmentMeetings.sort(Comparator.comparing(AppointmentMeeting::getDate).reversed());

                    for (int i = 0; i < 3; i++) {
                        if (appointmentMeetings.get(i).getCancelled()) {
                            missAppointment++;
                        }
                    }
                    if (missAppointment == 3)
                    {
                        clientsThatMissed.add(app);
                    }
                }
                missAppointment = 0;
            }
        }
        return clientsThatMissed;

    }

    /**
     * check if the clients belonging to the signed logged in user have missed three or more appointments in a row.
     *
     * @return a LinkedList of the client that has missed their last three appointments.
     */
    @RequestMapping(value = "/behavioralSignsMissedAppAll", method = RequestMethod.GET)
    public List<Client> behavioralSignsMissedAppAll() {

        List<Client> clientsApp = getSupportWorkersClients();
        List<AppointmentMeeting> allAppointmentMeetings = new ArrayList<>();
        List<Client> returnClient = new ArrayList<>();
        AtomicInteger missAppointment = new AtomicInteger();

        for (Client c : clientsApp) {
            missAppointment.set(0);
            allAppointmentMeetings.clear();
            for (Appointment app : c.getAppointments()) {
                allAppointmentMeetings.addAll(app.getAppointmentMeetings());
            }
            if (allAppointmentMeetings.size() > 2) {
                allAppointmentMeetings.sort(Comparator.comparing(AppointmentMeeting::getDate).reversed());
                IntStream.rangeClosed(1, 3)
                        .forEach((x) -> {
                            if (allAppointmentMeetings.get(x).getCancelled())
                                missAppointment.getAndIncrement();
                            if (missAppointment.get() == 3)
                                returnClient.add(c);
                        });
                //testing lambdas
                //for (int i = 0; i < 3; i++) {
                //    if (allAppointmentMeetings.get(i).getCancelled())
                //       missAppointment.getAndIncrement();
                //    if (missAppointment.get() == 3)
                //       returnClient.add(c);
                //  }
            }else{
                throw new IndexOutOfBoundsException("Not enough appointment meetings for behavioral checking.");
            }
        }
        return returnClient;
    }

    /**
         * @return the ROLE of the logged in user.
     */
    @NotNull
    @RequestMapping(value = "/getLoggedInRole", method = RequestMethod.GET)
    private static String getLoggedInRole() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof RequestUserDetails) {
            Collection<? extends GrantedAuthority> authorities = ((RequestUserDetails) principal).getAuthorities();

            if (authorities.contains(new SimpleGrantedAuthority("ROLE_MANAGER")))
                return "ROLE_MANAGER";
            if (authorities.contains(new SimpleGrantedAuthority("ROLE_STAFF")))
                return "ROLE_STAFF";
            if (authorities.contains(new SimpleGrantedAuthority("ROLE_CLIENT")))
                return "ROLE_CLIENT";
        }
        throw new NoSuchElementException("No logged in user");
    }

    /**
     * returns the ID of the logged in user.
     *
     * @return the ID of the logged in use in Long format.
     */
    @RequestMapping(value = "/getLoggedInID", method = RequestMethod.GET)
    static Long getLoggedInID() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof RequestUserDetails) {
            return ((RequestUserDetails) principal).getID();
        } else {
            throw new NoSuchElementException("No logged in user");
        }
    }

    static String getUserName(@NotNull String firstName, @NotNull String lastName, @NotNull ClientRepository clients, @NotNull StaffRepository staffMembers) {
        String username = firstName+lastName;
        while(!(clients.findByUsername(username).isEmpty() && staffMembers.findByUsername(username).isEmpty())) {
            Random rand = new Random();
            username += rand.nextInt(100);
        }
        return username;
    }

}

