package gairos.xrpl_radar.app.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gairos.xrpl_radar.app.repository.UAWRecordRepository;
import gairos.xrpl_radar.app.entity.UAWRecord;
import gairos.xrpl_radar.app.dto.ServiceUawDataDto;
import gairos.xrpl_radar.common.TimeUtils;

@Service
public class UawDataService {
    
    @Autowired
    private UAWRecordRepository uawRecordRepository;
    
    public List<ServiceUawDataDto> getLast168HoursUawDataByService() {
        LocalDateTime endTime = TimeUtils.getLatestCompletedHourStart();
        LocalDateTime startTime = TimeUtils.get168HoursAgoStart();
        
        List<UAWRecord> allRecords = uawRecordRepository.findByTimeRangeOrderByCollectionStartTime(startTime, endTime);
        
        Map<String, List<UAWRecord>> groupedByService = allRecords.stream()
            .collect(Collectors.groupingBy(UAWRecord::getServiceName));
        
        List<ServiceUawDataDto> result = new ArrayList<>();
        
        for (Map.Entry<String, List<UAWRecord>> entry : groupedByService.entrySet()) {
            String serviceName = entry.getKey();
            List<UAWRecord> serviceRecords = entry.getValue();
            
            List<Integer> uawData = serviceRecords.stream()
                .sorted(Comparator.comparing(UAWRecord::getCollectionStartTime))
                .map(UAWRecord::getUawCount)
                .collect(Collectors.toList());
            
            while (uawData.size() < 168) {
                uawData.add(0);
            }
            
            if (uawData.size() > 168) {
                uawData = uawData.subList(uawData.size() - 168, uawData.size());
            }
            
            result.add(new ServiceUawDataDto(serviceName, uawData));
        }
        
        return result;
    }
} 