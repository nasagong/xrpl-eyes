package gairos.xrpl_radar.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import gairos.xrpl_radar.common.ResponseDto;
import gairos.xrpl_radar.user.entity.User;
import gairos.xrpl_radar.user.service.UserService;
import gairos.xrpl_radar.user.dto.UserRequestDto;
import gairos.xrpl_radar.user.dto.UserIdResponseDto;
import gairos.xrpl_radar.user.dto.UserCardUpdateDto;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<ResponseDto<UserIdResponseDto>> registerUser(@RequestBody UserRequestDto dto) {
        String generatedId = userService.createUser(dto);
        return ResponseEntity.ok(
            ResponseDto.success("등록 성공", new UserIdResponseDto(generatedId))
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDto<User>> loginUser(@RequestBody UserRequestDto dto) {
        User user = userService.loginUser(dto);
        return ResponseEntity.ok(
            ResponseDto.success("로그인 성공", user)
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ResponseDto<User>> getUser(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(
            ResponseDto.success("조회 성공", user)
        );
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<ResponseDto<User>> updateUser(@PathVariable String userId, @RequestBody UserCardUpdateDto dto) {
        User updatedUser = userService.updateUserCard(userId, dto);
        return ResponseEntity.ok(
            ResponseDto.success("수정 성공", updatedUser)
        );
    }
}
