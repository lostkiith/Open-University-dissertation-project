package TM470Project.Repositories;

import TM470Project.Model.Staff;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface StaffRepository extends MongoRepository<Staff, String> {

    Optional<Staff> findByNinNumber(long ninNumber);

    Optional<Staff> findByUsername(String username);
}

