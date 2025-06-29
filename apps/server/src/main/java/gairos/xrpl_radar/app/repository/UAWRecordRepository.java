package gairos.xrpl_radar.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import gairos.xrpl_radar.app.entity.UAWRecord;
import java.time.LocalDateTime;
import java.util.List;

public interface UAWRecordRepository extends JpaRepository<UAWRecord, Long> {

    @Query("SELECT u FROM UAWRecord u WHERE u.collectionStartTime >= :startTime AND u.collectionStartTime <= :endTime ORDER BY u.collectionStartTime ASC")
    List<UAWRecord> findByTimeRangeOrderByCollectionStartTime(
        @Param("startTime") LocalDateTime startTime, 
        @Param("endTime") LocalDateTime endTime
    );
    
    @Query("SELECT DISTINCT u.serviceName FROM UAWRecord u")
    List<String> findAllServiceNames();
} 