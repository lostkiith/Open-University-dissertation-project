package TM470Project.Model;

import lombok.Data;
import org.jetbrains.annotations.Contract;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;


/**
 * Represents an abstract Staff member.
 * @author Luke Daniels.
 */
@Data
public abstract class Staff extends Person {

    private Address address;
    @Id
    private Long ninNumber;
    private AreaOfExperience areaOfExperience;

    /**
     * @param firstName        The staff members first name.
     * @param lastName         The staff members last name.
     * @param sex              The staff members sex.
     * @param dateOfBirth      The staff members date of birth.
     * @param address          The staff members address.
     * @param ninNumber        The staff members national insurance number
     * @param areaOfExperience The staff members area of experience.
     */
    Staff(String firstName, String lastName, Sex sex,
          LocalDate dateOfBirth, Address address,
          long ninNumber, AreaOfExperience areaOfExperience,
          String username, String password) {
        super(firstName, lastName, sex, dateOfBirth, username, password);
        this.address = address;
        this.ninNumber = ninNumber;
        this.areaOfExperience = areaOfExperience;
    }

    Staff() {
    }

    /**
     * sets the address variable to a new address object.
     *
     * @param address The new address name.
     */
    public void setAddress(Address address) {
        this.address = address;
    }

    /**
     * changes the areaOfExperience.
     *
     * @param areaOfExperience the area of experience the staff member has.
     */
    void setAreaOfExperience(AreaOfExperience areaOfExperience) {
        this.areaOfExperience = areaOfExperience;
    }

    @Contract(value = "null -> false", pure = true)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Staff)) return false;
        if (!super.equals(o)) return false;

        Staff staff = (Staff) o;

        return ninNumber.equals(staff.ninNumber);
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + ninNumber.hashCode();
        return result;
    }
}
