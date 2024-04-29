package com.domi.domitube.Repository.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
