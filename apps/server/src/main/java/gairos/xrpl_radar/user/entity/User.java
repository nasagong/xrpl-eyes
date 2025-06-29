package gairos.xrpl_radar.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users") 
public class User {

    @Id
    private String _id; 

    @Column(name = "id", unique = true)
    private String id;  

    @Column(name = "password")
    private String password;

    @Embedded
    private Card card;

    @Embeddable
    @Getter
    @Setter
    public static class Card {
        private String grade;
        private Integer sequence;
        private Integer color1;
        private Integer color2;
        private Integer color3;
    }
}