package com.domi.domitube.Studio;

import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/studio/setting")
public class SettingController {
    final UserService userService;

    @GetMapping("/banner")
    boolean GetMyBanner(HttpServletRequest request, HttpServletResponse response) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            response.setStatus(401);
            return false;
        }

        return user.getBanner();
    }

    @PostMapping("/upload")
    ResponseEntity UploadSetting(@RequestParam(value ="name", required=false) String name, @RequestParam(value ="icon", required=false) MultipartFile iconFile, @RequestParam(value ="banner", required=false) MultipartFile bannerFile, HttpServletRequest request) {
        System.out.println(name);
        System.out.println(iconFile);
        System.out.println(bannerFile);
        return ResponseEntity.ok("test");
    }
}
