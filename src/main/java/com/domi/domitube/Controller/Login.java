package com.domi.domitube.Controller;

import com.domi.domitube.DTO.JWTparseDTO;
import com.domi.domitube.Service.JWTservice;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class Login {
    final JWTservice jwtService;

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
