package TM470Project.Configuration;

import TM470Project.Model.*;
import TM470Project.Repositories.ClientRepository;
import TM470Project.Repositories.StaffRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;


import java.util.Collections;
import java.util.List;
@Component
public class MongoUserDetailsService implements UserDetailsService{

    private final StaffRepository staffRepository;

    private final ClientRepository clientRepository;

    public MongoUserDetailsService(StaffRepository staffRepository, ClientRepository clientRepository) {
        this.staffRepository = staffRepository;
        this.clientRepository = clientRepository;
    }

    /**
     * authenticate the username provided.
     * @param username the manager, support staff member or client username.
     * @return  returns the UserDetails for the staff or client.
     * @throws UsernameNotFoundException    throws an error if the username does not match a
     * staff or client.
     */
    @Override
    public RequestUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Client userClient;
        Staff userStaff;

        if (staffRepository.findByUsername(username).isPresent()) {
            userStaff = staffRepository.findByUsername(username).get();
            if (userStaff instanceof Manager) {
                List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_MANAGER"));
                return new RequestUserDetails(userStaff.getUsername(), userStaff.getPassword(), userStaff.getFirstName(), userStaff.getLastName(), authorities, userStaff.getNinNumber());
            }else{
                List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_STAFF"));
                return new RequestUserDetails(userStaff.getUsername(), userStaff.getPassword(),userStaff.getFirstName(), userStaff.getLastName(), authorities, userStaff.getNinNumber());
            }
        }else if (clientRepository.findByUsername(username).isPresent()){
            userClient = clientRepository.findByUsername(username).get();
            List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_CLIENT"));
            return new RequestUserDetails(userClient.getUsername(), userClient.getPassword(), userClient.getFirstName(), userClient.getLastName(), authorities, userClient.getNationalHealthServiceNumber());
        }else{
            throw new UsernameNotFoundException("User not found");
        }
    }
}
