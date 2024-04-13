package com.domi.domitube.Service;

import com.domi.domitube.DTO.JWTtokenDTO;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JWTservice {
    @Value("${jwt.secret.key}")
    private String SECRET_KEY;
    final SecretKey Key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY));

    public JWTtokenDTO CreateToken(String id) {
        Date nowTime = new Date();

        String accessToken = Jwts.builder()
                .claim("id", id)
                .issuer("domi")
                .expiration(new Date(nowTime.getTime() + 3_600_000))
                .signWith(Key)
                .compact();

        String refreshToken = Jwts.builder()
                .claim("id", id)
                .claim("refresh", true)
                .issuer("domi")
                .expiration(new Date(nowTime.getTime() + 3_600_000))
                .signWith(Key)
                .compact();

        return JWTtokenDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
