package TM470Project.Repositories;

import TM470Project.Model.Client;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ClientRepository extends MongoRepository<Client, String> {

    Optional<Client> findClientByNationalHealthServiceNumber(long NHSnumber);

    Optional<Client> findByUsername(String username);
}
