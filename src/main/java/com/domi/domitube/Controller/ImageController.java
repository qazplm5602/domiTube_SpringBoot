package com.domi.domitube.Controller;

import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileNotFoundException;
import java.net.MalformedURLException;

enum ImageCategory {
    user,
    banner,
    thumnail
}

@RestController
@RequestMapping("/api/image")
public class ImageController {
    final String startPath = System.getenv("DOMI_ASSETS");

    @GetMapping("/user/{id}")
    ResponseEntity<UrlResource> GetUserIcon(@PathVariable String id) {
        UrlResource resource = GetFile(ImageCategory.user, id+".png"); // 파일 불러왕

        if (resource == null) { // 파일 없음
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header("Content-Type", "image/png")
                .body(resource);
    }

    @GetMapping("/banner/{id}")
    ResponseEntity<UrlResource> GetBannerIcon(@PathVariable String id) {
        UrlResource resource = GetFile(ImageCategory.banner, id+".jpg"); // 파일 불러왕

        if (resource == null) { // 파일 없음
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header("Content-Type", "image/jpg")
                .body(resource);
    }

    @GetMapping("/thumbnail/{id}")
    ResponseEntity<UrlResource> GetThumbnailIcon(@PathVariable String id) {
        UrlResource resource = GetFile(ImageCategory.thumnail, id+".jpg"); // 파일 불러왕

        if (resource == null) { // 파일 없음
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header("Content-Type", "image/jpg")
                .body(resource);
    }

    UrlResource GetFile(ImageCategory type, String file) {
        UrlResource resource = null;
        String path = String.format("file:%s/%s/%s", startPath, type.toString(), file);

        try {
            resource = new UrlResource(path); // 파일 불러왕
            
            // 파일 없음
            if (!resource.exists()) resource = null;
        } catch (MalformedURLException ignore) {}

        return resource;
    }
}
