package com.exportservice.exportservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
@EnableFeignClients
public class ExportserviceApplication {

	public static void main(String[] args) {
		System.out.println("dk---");
		System.getenv().forEach((k, v) -> {
			// if (k.contains("EXPORT")) {
				System.out.println(k + " = " + v);
			// }
		});
		SpringApplication.run(ExportserviceApplication.class, args);
	}

}
