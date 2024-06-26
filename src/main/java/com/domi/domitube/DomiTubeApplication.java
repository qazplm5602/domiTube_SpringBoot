package com.domi.domitube;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.web.servlet.ServletComponentScan;

@ServletComponentScan
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class DomiTubeApplication {

	public static void main(String[] args) {
		SpringApplication.run(DomiTubeApplication.class, args);
	}

}
