package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.HotelResponse;
import com.example.backend.service.HotelApiService;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "http://localhost:3000")
public class HotelController {
    
    @Autowired
    private HotelApiService hotelApiService;
    
    @GetMapping("/search")
    public ResponseEntity<?> searchHotels(@RequestParam String location) {
        try {
            List<HotelResponse> hotels = hotelApiService.searchHotelsByCity(location);
            return ResponseEntity.ok(hotels);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ErrorResponse("Failed to fetch hotels: " + e.getMessage())
            );
        }
    }
    
    static class ErrorResponse {
        private String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
        
        public String getError() {
            return error;
        }
        
        public void setError(String error) {
            this.error = error;
        }
    }
}
