package TM470Project.Configuration;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class RequestUserDetails extends org.springframework.security.core.userdetails.User {

    private final String firstName;
    private final String lastName;
    private final Long ID;

    RequestUserDetails(String username, String password, String firstName, String lastName, Collection<? extends GrantedAuthority> authorities, Long id) {
        super(username, password, authorities);
        this.firstName = firstName;
        this.lastName = lastName;
        this.ID = id;
    }

    public Long getID() {
        return ID;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }
}
