package gairos.xrpl_radar.user.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gairos.xrpl_radar.user.entity.User;
import gairos.xrpl_radar.user.repository.UserRepository;
import gairos.xrpl_radar.user.dto.UserRequestDto;
import gairos.xrpl_radar.user.dto.UserCardUpdateDto;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String createUser(UserRequestDto userRequestDto) {
        String hashedPassword = passwordEncoder.encode(userRequestDto.getPassword());

        String generateId = UUID.randomUUID().toString();

        User user = new User();
        user.set_id(generateId);
        user.setId(userRequestDto.getId());
        user.setPassword(hashedPassword);

        long userCount = userRepository.count();

        User.Card card = new User.Card();
        card.setGrade("bronze");
        card.setSequence((int) userCount);
        card.setColor1(0);
        card.setColor2(0);
        card.setColor3(0);
        user.setCard(card);

        userRepository.save(user);
        return generateId;
    }

    public User loginUser(UserRequestDto userRequestDto) {
        Optional<User> optionalUser = userRepository.findByUserId(userRequestDto.getId());
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }

        User user = optionalUser.get();
        
        // 비밀번호 검증
        if (!passwordEncoder.matches(userRequestDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return user;
    }

    public User getUserById(String userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        return optionalUser.orElse(null);  
    }

    public User updateUserCard(String userId, UserCardUpdateDto dto) {
        logger.info("updateUserCard called with userId: {}, dto: {}", userId, dto);
        
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            logger.error("User not found with userId: {}", userId);
            return null;
        }

        User user = optionalUser.get();
        logger.info("Found user: {}", user.getId());

        if (dto != null && dto.getCard() != null) {
            UserCardUpdateDto.Card reqCard = dto.getCard();
            User.Card existingCard = user.getCard();
            
            logger.info("Updating card - existing: {}, requested: {}", existingCard, reqCard);
            
            // Create new card object preserving existing values
            User.Card updatedCard = new User.Card();
            updatedCard.setGrade(reqCard.getGrade() != null ? reqCard.getGrade() : existingCard.getGrade());
            updatedCard.setSequence(reqCard.getSequence() != null ? reqCard.getSequence() : existingCard.getSequence());
            updatedCard.setColor1(reqCard.getColor1() != null ? reqCard.getColor1() : existingCard.getColor1());
            updatedCard.setColor2(reqCard.getColor2() != null ? reqCard.getColor2() : existingCard.getColor2());
            updatedCard.setColor3(reqCard.getColor3() != null ? reqCard.getColor3() : existingCard.getColor3());

            logger.info("Updated card: {}", updatedCard);
            user.setCard(updatedCard);
        }

        User savedUser = userRepository.save(user);
        logger.info("Saved user: {}", savedUser.getId());
        return savedUser;
    }
}