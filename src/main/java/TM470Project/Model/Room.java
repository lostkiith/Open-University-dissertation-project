package TM470Project.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.jetbrains.annotations.Contract;

/**
 * Represents a room in a supported house.
 * @author Luke Daniels.
 */

@Data
class Room {

    @JsonIgnore
    private Client occupantClient;
    private int number;

    /**
     * creates a new Room object.
     * @param number sets the number for the room.
     */
    @Contract(pure = true)
    Room(int number) {
        this.number = number;
    }

    @Contract(pure = true)
    private Room() {
    }

    /**
     * check if rooms occupant is the pass client as the client object passed.
     * @param client the client to check against the room.
     */
    Boolean isOccupant(Client client) {
        if (occupantClient == null)
            return false;
        else
            return occupantClient.equals(client);
    }

    /**
     * check if rooms occupant is the pass client as the client object passed.
     */
    void removeOccupant() {
        this.occupantClient = null;
    }

}
