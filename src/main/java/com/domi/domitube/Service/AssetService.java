package com.domi.domitube.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;

@Service
public class AssetService {
    public enum Category {
        user,
        banner,
        thumnail,
        video,
        temp
    }

    final String startPath = System.getenv("DOMI_ASSETS");

    public String GetPath(Category category) {
        return String.format("%s/%s", startPath, category.toString());
    }

    String GetFileExtById(Category category, String id) {
        String path = GetPath(category);
        String fileNameF = String.format("%s.", id);
        File dir = new File(path);

        File[] files = dir.listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File file, String s) {
                return s.startsWith(fileNameF);
            }
        });

        if (files == null || files.length == 0) return null;

        String fileName = files[0].getName();
        return fileName.substring(fileName.indexOf(".") + 1);
    }

    public void AddFile(Category category, String id, MultipartFile multiFile) throws IOException {
        String originFileName = multiFile.getOriginalFilename();
        if (originFileName == null) originFileName = ".png";

        String ext = originFileName.substring(originFileName.indexOf('.') + 1);
        String path = String.format("%s/%s.%s", GetPath(category), id, ext);

        System.out.println(path);
        File file = new File(path);
        multiFile.transferTo(file);
    }

    public boolean DeleteFile(Category category, String id) {
        String path = GetPath(category);
        File file = new File(path+ "/" + id + "." + GetFileExtById(category, id));

        System.out.println(file.exists() && file.delete());
        return true;
    }
}
