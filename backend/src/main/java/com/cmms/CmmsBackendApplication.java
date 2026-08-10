package com.cmms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CmmsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CmmsBackendApplication.class, args);
	}

}
