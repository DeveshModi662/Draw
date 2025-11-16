package com.exportservice.exportservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ExportserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExportserviceApplication.class, args);
		// System.out.println("dk---");
		// System.getenv().forEach((k, v) -> {
		// 	// if (k.contains("EXPORT")) {
		// 		System.out.println(k + " = " + v);
		// 	// }
		// });
	}

}
