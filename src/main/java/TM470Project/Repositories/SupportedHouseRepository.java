package TM470Project.Repositories;

import TM470Project.Model.SupportedHouse;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SupportedHouseRepository extends MongoRepository<SupportedHouse, String> {

    Optional<SupportedHouse> findSupportedHouseByHouseName(String houseName);
}
