package com.domi.domitube.Repository;

import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Object> {
    @Query("SELECT c FROM Video c WHERE c.owner = :user")
    List<Video> GetVideosByUser(@Param("user") User user);

    @Query("SELECT c FROM Video c WHERE c.owner = :user ORDER BY c.created DESC")
    List<Video> GetVideosByUserLastest(@Param("user") User user, Pageable pageable);
    @Query("SELECT c FROM Video c WHERE c.owner = :user ORDER BY c.views DESC")
    List<Video> GetVideosByUserPopular(@Param("user") User user, Pageable pageable);
    @Query("SELECT c FROM Video c WHERE c.owner = :user ORDER BY c.created")
    List<Video> GetVideosByUserDate(@Param("user") User user, Pageable pageable);
}
