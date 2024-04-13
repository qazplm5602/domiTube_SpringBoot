package com.domi.domitube.DTO;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class JWTparseDTO {
    public enum Type {
        Access,
        Refresh
    }

    String id;
    Type type;
}
