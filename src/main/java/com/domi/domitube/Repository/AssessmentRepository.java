package com.domi.domitube.Repository;

import com.domi.domitube.Repository.Entity.Assessment;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Object> {
    @Query("SELECT c.type FROM Assessment c WHERE c.user = :user AND c.video = :video")
    Assessment.Type GetVideoAssessType(@Param("user") User user, @Param("video") Video video);

    @Query("SELECT c FROM Assessment c WHERE c.user = :user AND c.video = :video")
    Assessment GetVideoAssess(@Param("user") User user, @Param("video") Video video);

    @Modifying
    @Transactional
    @Query("DELETE FROM Assessment c WHERE c.user = :user AND c.video = :video")
    void DeleteVideoAssess(@Param("user") User user, @Param("video") Video video);
}
