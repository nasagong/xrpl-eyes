package gairos.xrpl_radar.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCardUpdateDto {
    private Card card;

    @Getter
    @Setter
    public static class Card {
        private String grade;
        private Integer sequence; // int → Integer
        private Integer color1;
        private Integer color2;
        private Integer color3;
    }
}