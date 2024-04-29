package com.domi.domitube.Service;

import com.domi.domitube.Repository.AssessmentRepository;
import com.domi.domitube.Repository.Entity.Assessment;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssessmentService {
    final AssessmentRepository assessmentRepository;

    public Assessment.Type GetVideoAssessForId(Video video, User user) {
        return assessmentRepository.GetVideoAssessType(user, video);
    }

    public void SetVideoAssess(User user, Video video, Assessment.Type type) {
        assessmentRepository.save(Assessment.builder().user(user).video(video).type(type).build());
    }

    public void DeleteVideoAssess(User user, Video video) {
        assessmentRepository.DeleteVideoAssess(user, video);
    }
}
