package gairos.xrpl_radar.common;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public class TimeUtils {
    
    public static LocalDateTime getCurrentUtcTime() {
        return LocalDateTime.now(ZoneOffset.UTC);
    }
    
    public static LocalDateTime getLatestCompletedHourStart() {
        LocalDateTime now = getCurrentUtcTime();
        return now.withMinute(0).withSecond(0).withNano(0).minusHours(1);
    }
    
    public static LocalDateTime get168HoursAgoStart() {
        return getLatestCompletedHourStart().minusHours(167); // 168개 데이터를 위해 167시간 전
    }
    
    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
} 