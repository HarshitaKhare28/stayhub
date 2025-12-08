package com.example.backend.dto;

import java.util.List;

public class HotelResponse {
    private String hotelName;
    private String hotelId;
    private List<PriceInfo> prices;
    
    public HotelResponse() {}
    
    public HotelResponse(String hotelName, String hotelId, List<PriceInfo> prices) {
        this.hotelName = hotelName;
        this.hotelId = hotelId;
        this.prices = prices;
    }
    
    // Getters and Setters
    public String getHotelName() {
        return hotelName;
    }
    
    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }
    
    public String getHotelId() {
        return hotelId;
    }
    
    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }
    
    public List<PriceInfo> getPrices() {
        return prices;
    }
    
    public void setPrices(List<PriceInfo> prices) {
        this.prices = prices;
    }
    
    public static class PriceInfo {
        private String price;
        private String tax;
        private String vendor;
        
        public PriceInfo() {}
        
        public PriceInfo(String price, String tax, String vendor) {
            this.price = price;
            this.tax = tax;
            this.vendor = vendor;
        }
        
        // Getters and Setters
        public String getPrice() {
            return price;
        }
        
        public void setPrice(String price) {
            this.price = price;
        }
        
        public String getTax() {
            return tax;
        }
        
        public void setTax(String tax) {
            this.tax = tax;
        }
        
        public String getVendor() {
            return vendor;
        }
        
        public void setVendor(String vendor) {
            this.vendor = vendor;
        }
    }
}
