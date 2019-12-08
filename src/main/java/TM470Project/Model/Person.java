package TM470Project.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;

/**
 * A abstract Representation of a person in the charity.
 * @author Luke Daniels.
 */
@Data
abstract class Person {

    private String firstName;
    private String lastName;
    private Sex sex;
    private LocalDate dateOfBirth;
    private String username;
    @JsonIgnore
    private String password;

    @Contract(pure = true)
    Person(@NotNull String firstName,@NotNull String lastName,
           @NotNull Sex sex,@NotNull LocalDate dateOfBirth,
           @NotNull String username,@NotNull String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.sex = sex;
        this.dateOfBirth = dateOfBirth;
        this.username = username;
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        this.password = encoder.encode(password);
    }

    @Contract(pure = true)
    Person() {
    }
}
