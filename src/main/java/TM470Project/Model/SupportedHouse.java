package TM470Project.Model;

import lombok.Data;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

/**
 * Represents an Supported House managed by the charity.
 *
 * @author Luke Daniels.
 */
@Data
@Document(collection="supportedHouse")
public class SupportedHouse {
    @Id
    private String houseName;
    private Sex gender;
    private AreaOfExperience specificCondition;
    private Address address;
    private ArrayList<Room> rooms;


    private SupportedHouse(@NotNull String houseName, @NotNull Sex gender, @NotNull AreaOfExperience specificCondition, @NotNull Address address, int roomNumber) {
        this.houseName = houseName;
        this.gender = gender;
        this.specificCondition = specificCondition;
        this.address = address;
        rooms = new ArrayList<>();
        for (int i = 0; i < roomNumber; i++) {
            rooms.add(new Room(i + 1));
        }
    }

    //needed for the spring Database to work.
    @Contract(pure = true)
    SupportedHouse() {
    }

    /**
     * creates a Supported House object.
     * @param houseName         The name of the supported house.
     * @param gender            If the house is gender specific.
     * @param specificCondition If the house is condition specific.
     * @param address           The address of the supported house.
     * @param roomNumber        The number of rooms in the supported house.
     * @return returns the created supported House.
     */
    @Contract("_, _, _, _, _ -> new")
    @NotNull
    public static SupportedHouse createSupportedHouse(String houseName, Sex gender, AreaOfExperience specificCondition, Address address, int roomNumber) {
        return new SupportedHouse(houseName, gender, specificCondition, address, roomNumber);
    }

    /**
     * checks each room in the supported house to see if it is available for occupancy.
     * @return an ArrayList with the room number for each free room.
     */
    public ArrayList<Integer> availableRooms() {
        ArrayList<Integer> available = new ArrayList<>();
        for (Room r : rooms)
            if (r.getOccupantClient() == null) available.add(r.getNumber());
        return available;
    }

    /**
     * register a client to the supported house and one of its free rooms.
     * @param client the client to be registered.
     */
    public void registerOccupant(Client client) throws IllegalArgumentException {
        //check if client is already registered.

        if(client.getCurrentSupportedHouseObject() != null)
            if (client.getCurrentSupportedHouseObject().equals(this))
                throw new IllegalArgumentException("The client: " + client.getFirstName() + " "
                        + client.getLastName() + " is already registered in this supported house.");

        ArrayList<Integer> availableRooms = this.availableRooms();
        if (!availableRooms.isEmpty()) {
            int availableRoom = availableRooms.get(0);
            for (Room r : rooms)
                if (r.getNumber() == availableRoom) {
                    if (client.getSex() == this.gender && client.getGeneralCondition() == this.specificCondition) {
                        r.setOccupantClient(client);
                        client.setCurrentSupportedHouse(this);
                    } else
                        throw new IllegalArgumentException("the clients sex or condition does not match the supported house.");
                }
        } else
            throw new ArrayIndexOutOfBoundsException("No available rooms.");
    }

    /**
     * remove a client from the supported house.
     * @param client The client ti remove.
     * @return Return true if the client is removed or false if not found.
     */
    public boolean removeOccupant(Client client) {

        for (Room r : rooms) {
            if (r.getOccupantClient() != null && r.isOccupant(client)) {
                r.removeOccupant();
                client.setCurrentSupportedHouse(null);
                return true;
            }
        }
        return false;
    }

    /**
     * Find the room number of a client and return it. or if no client is found return 0
     * @param c the client who's room number to return.
     * @return return the room number of the client or 0 of the client is not found.
     */
    public int findOccupantRoom(Client c) {

        for (Room r : rooms) {
            Client c1 = r.getOccupantClient();
            if (r.getOccupantClient() != null && r.getOccupantClient().equals(c))
                return r.getNumber();
        }
        return 0;
    }

    /**
     * returns if a client is staying at the supported house.
     * @param c the client to check for.
     * @return returns true if they are in this supported house or false if not.
     */
    public boolean findOccupant(Client c) {
        for (Room r : rooms) {
            if (r.getOccupantClient() != null && r.getOccupantClient().equals(c))
                return true;
        }
        return false;
    }

    /**
     * change the gender of the supported house. only on a supported house with no occupants.
     * @param gender the gender to change the supported house to.
     */
    void setGender(Sex gender) {
        for (Room r : rooms) {
            if (r.getOccupantClient() != null) {
                throw new IllegalArgumentException("cannot reassign the gender of a supported house if it currently has clients.");
            }
        }
        this.gender = gender;
    }

    /**
     * change the Condition of the supported house. only on a supported house with no occupants.
     * @param specificCondition the specific Condition to change the supported house to.
     */
    void setSpecificCondition(AreaOfExperience specificCondition) {
        for (Room r : rooms) {
            if (r.getOccupantClient() != null) {
                throw new IllegalArgumentException("cannot reassign the gender of a supported house if it currently has clients.");
            }
        }
        this.specificCondition = specificCondition;
    }

    @Contract(value = "null -> false", pure = true)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SupportedHouse)) return false;

        SupportedHouse that = (SupportedHouse) o;

        if (!houseName.equals(that.houseName)) return false;
        if (!address.equals(that.address)) return false;
        return rooms.equals(that.rooms);
    }

    @Override
    public int hashCode() {
        int result = houseName.hashCode();
        result = 31 * result + address.hashCode();
        result = 31 * result + rooms.hashCode();
        return result;
    }
}