package com.domi.domitube.Controller;

import com.domi.domitube.DTO.JWTparseDTO;
import com.domi.domitube.Service.JWTservice;
import com.domi.domitube.Service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.domi.domitube.Repository.Entity.User;

import java.util.Map;

class LoginFieldDTO {
    @NotEmpty(message = "아이디는 필수값 입니다.")
    public String id;
    @NotEmpty(message = "비밀번호는 필수값 입니다.")
    public String password;
}

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class Login {
    final JWTservice jwtService;
    final UserService userService;
    final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    Map<String, Object> LoginUser(@RequestBody @Valid LoginFieldDTO field) {
        User user = userService.GetUserForId(field.id);

        if (user == null || !passwordEncoder.matches(field.password, user.getPassword())) {
            return Map.of("result", false, "reason", "아이디 및 비밀번호가 일치하지 않습니다.");
        }

        return Map.of(
            "result", true,
            "data", jwtService.CreateToken(user.getId())
        );
    }

    @PostMapping("/relogin")
    Map<String, Object> CreateAccessForRefreshToken(@RequestBody String token) {
        JWTparseDTO data;
        try {
            data = jwtService.ParseToken(token);
        } catch(Exception e) {
            return Map.of(
                    "success", false,
                    "reason", "jwt exception"
            );
        }

        if (data.getType() != JWTparseDTO.Type.Refresh) {
            return Map.of(
                    "success", false,
                    "reason", "refresh 토큰이 아닙니다."
            );
        }

        return Map.of(
                "success", true,
                "accessToken", jwtService.CreateToken(data.getId(), true).getAccessToken()
        );
    }
}
