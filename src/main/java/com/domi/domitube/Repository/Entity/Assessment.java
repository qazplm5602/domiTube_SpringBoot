package com.domi.domitube.Repository.Entity;

import jakarta.persistence.*;

@Entity(name = "Assessment")
@IdClass(AssessmentPK.class)
public class Assessment {
    @Id
    @ManyToOne
    User user;

    @Id
    @ManyToOne
    Video video;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    Type type;

    public enum Type {
        Good,
        Bad
    }
}
