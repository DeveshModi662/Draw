package com.dorobe.dorobe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DorobeApplication {

	public static void main(String[] args) {
		// System.out.println("PORTBE = " + System.getenv("PORTBE"));
		SpringApplication.run(DorobeApplication.class, args);
	}

}
