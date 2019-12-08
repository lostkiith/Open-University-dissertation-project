package TM470Project.Model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDate;

/**
 * Represents an Staff member with the responsibility of management.
 * @author Luke Daniels.
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class Manager extends Staff {

    private Manager(@NotNull String firstName,@NotNull String lastName,@NotNull Sex sex,@NotNull LocalDate dateOfBirth,@NotNull Address address,@NotNull Long ninNumber,
                    @NotNull AreaOfExperience areaOfExperience,@NotNull String username,@NotNull String password) {
        super(firstName, lastName, sex, dateOfBirth, address, ninNumber, areaOfExperience, username, password);
    }

    Manager() {
    }

    /**
     * Creates a Manager.
     * @param firstName        The Manager first name.
     * @param lastName         The Manager last name.
     * @param sex              The Manager sex.
     * @param dateOfBirth      The Manager date of birth.
     * @param address          The Manager address.
     * @param ninNumber        The Manager insurance number.
     * @param areaOfExperience The Manager area of experience.
     */
    @Contract("_, _, _, _, _, _, _, _, _ -> new")
    @NotNull
    public static Manager createManager(String firstName, String lastName, Sex sex, LocalDate dateOfBirth, Address address, Long ninNumber,
                                 AreaOfExperience areaOfExperience, String username, String password) {
        return new Manager(firstName, lastName, sex, dateOfBirth, address, ninNumber, areaOfExperience,username, password);
    }
}
