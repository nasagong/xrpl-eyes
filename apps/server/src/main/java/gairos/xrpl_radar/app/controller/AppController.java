package gairos.xrpl_radar.app.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import gairos.xrpl_radar.common.ResponseDto;
import gairos.xrpl_radar.app.dto.ServiceUawDataDto;
import gairos.xrpl_radar.app.service.UawDataService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AppController {
    
    private final UawDataService uawDataService;
    
    @Autowired
    public AppController(UawDataService uawDataService) {
        this.uawDataService = uawDataService;
    }
    
    @GetMapping("/apps")
    public ResponseEntity<ResponseDto<List<ServiceUawDataDto>>> getAppList() {
        List<ServiceUawDataDto> serviceData = uawDataService.getLast168HoursUawDataByService();
        return ResponseEntity.ok(ResponseDto.success("앱 목록 조회 성공", serviceData));
    }
} 