"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { countries, Country, getDefaultCountry } from "@/lib/countries";

interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
  disabled?: boolean;
  label?: string;
}

export function PhoneInputSimple({ value, onChange, disabled, label = "شماره موبایل" }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(getDefaultCountry());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryList(false);
    if (phoneNumber) {
      onChange(`${country.dialCode}${phoneNumber}`);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value.replace(/[^0-9]/g, "");
    setPhoneNumber(newPhone);
    
    if (newPhone) {
      onChange(`${selectedCountry.dialCode}${newPhone}`);
    } else {
      onChange("");
    }
  };

  // Initialize from value prop
  if (value && !phoneNumber) {
    const country = getDefaultCountry();
    if (value.startsWith(country.dialCode)) {
      setPhoneNumber(value.slice(country.dialCode.length));
    }
  }

  return (
    <div className="space-y-4">
      {/* Country Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">کشور</Label>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start text-left font-normal"
          disabled={disabled}
          onClick={() => setShowCountryList(!showCountryList)}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedCountry.flag}</span>
            <span>{selectedCountry.dialCode}</span>
            <span className="text-sm text-muted-foreground">{selectedCountry.nameFa}</span>
            <ChevronDown className="ml-auto h-4 w-4" />
          </div>
        </Button>
        
        {showCountryList && (
          <div className="border rounded-md bg-background max-h-60 overflow-y-auto">
            {countries.slice(0, 20).map((country) => (
              <button
                key={country.code}
                type="button"
                className={`w-full flex items-center gap-3 p-2 hover:bg-muted transition-colors text-sm text-right border-b last:border-b-0 ${
                  country.code === selectedCountry.code ? "bg-muted" : ""
                }`}
                onClick={() => handleCountryChange(country)}
              >
                <span className="text-lg">{country.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{country.nameFa}</div>
                  <div className="text-xs text-muted-foreground">
                    {country.dialCode}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Phone Number Input */}
      <div className="space-y-2">
        <Label htmlFor="phone">{label}</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-sm text-muted-foreground">
              {selectedCountry.dialCode}
            </span>
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="9121112225"
            value={phoneNumber}
            onChange={handlePhoneChange}
            disabled={disabled}
            className="pl-16"
            dir="ltr"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          شماره موبایل بدون پیش‌شماره وارد کنید (مثال: 9121112225)
        </p>
      </div>
    </div>
  );
}
