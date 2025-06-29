package gairos.xrpl_radar.app.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "uaw_records")
public class UAWRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @jakarta.persistence.Column(name = "service_name")
    private String serviceName;
    
    @jakarta.persistence.Column(name = "uaw_count")
    private Integer uawCount;
    
    @jakarta.persistence.Column(name = "total_transactions")
    private Integer totalTransactions;
    
    @jakarta.persistence.Column(name = "collection_start_time")
    private LocalDateTime collectionStartTime;
} 