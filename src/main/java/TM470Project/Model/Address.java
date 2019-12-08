package TM470Project.Model;

import lombok.Data;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

/**
 * Represents an address.
 * @author Luke Daniels.
 */
@Data
public class Address {

    private String addressFirstLine;
    private String addressSecondLine;
    private String country;
    private String town;
    private String postCode;

    private Address(@NotNull String addressFirstLine, @NotNull String addressSecondLine, @NotNull String country,
                    @NotNull String town, @NotNull String postCode) {
        this.addressFirstLine = addressFirstLine.toLowerCase();
        this.addressSecondLine = addressSecondLine.toLowerCase();
        this.country = country.toLowerCase();
        this.town = town.toLowerCase();
        this.postCode = postCode.toLowerCase();
    }

    /**
     * Creates an Address Object.
     * @param addressFirstLine  The first line of the address.
     * @param addressSecondLine The second line of the address.
     * @param country           The country of the address.
     * @param town              The town of the address.
     * @param postCode          The postCode of the address.
     */
    @NotNull
    @Contract("_, _, _, _, _ -> new")
    public static Address createAddress(String addressFirstLine, String addressSecondLine,
                                 String country, String town, String postCode) {
        return new Address(addressFirstLine, addressSecondLine, country, town, postCode);
    }
}
