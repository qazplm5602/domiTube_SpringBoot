package com.domi.domitube.Repository.Entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class AssessmentPK implements Serializable {
    private User user;
    private Video video;
}
