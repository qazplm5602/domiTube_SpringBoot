package com.domi.domitube.Repository.Entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class SubscribePK implements Serializable {
    private String id;
    private String targetId;
}
