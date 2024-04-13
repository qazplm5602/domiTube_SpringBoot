package com.domi.domitube.DTO;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class JWTtokenDTO {
    private String accessToken;
    private String refreshToken;
}
