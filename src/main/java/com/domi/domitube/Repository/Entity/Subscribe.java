package com.domi.domitube.Repository.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.io.Serializable;

@Entity
@Getter
@IdClass(SubscribePK.class)
@Table(name = "Subscribe"/*, indexes = @Index(name = "target__index", columnList = "targetId")*/)
public class Subscribe {
    @Id
    String id;

//    @Column(nullable = false)
    @Id
    String targetId;
}
