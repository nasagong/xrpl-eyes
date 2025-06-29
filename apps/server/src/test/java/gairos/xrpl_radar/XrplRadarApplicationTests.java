package gairos.xrpl_radar;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")  // 테스트 시 application-test.properties를 사용
class XrplRadarApplicationTests {

    @Test
    void contextLoads() {
    }

}