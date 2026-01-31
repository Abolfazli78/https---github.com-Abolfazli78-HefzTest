"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountrySelect } from "./country-select-simple";
import { Country, countries, getDefaultCountry } from "@/lib/countries";

interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
  disabled?: boolean;
  label?: string;
}

export function PhoneInput({ value, onChange, disabled, label = "شماره موبایل" }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(getDefaultCountry());

  const activeCountry = useMemo(() => {
    if (!value) return selectedCountry;

    const match = countries
      .slice()
      .sort((a, b) => b.dialCode.length - a.dialCode.length)
      .find((c) => value.startsWith(c.dialCode));

    return match ?? selectedCountry;
  }, [value, selectedCountry]);

  const phoneNumber = useMemo(() => {
    if (!value) return "";
    if (value.startsWith(activeCountry.dialCode)) {
      return value.slice(activeCountry.dialCode.length).replace(/[^0-9]/g, "");
    }

    return value.replace(/[^0-9]/g, "");
  }, [value, activeCountry.dialCode]);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    if (phoneNumber) onChange(`${country.dialCode}${phoneNumber}`);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value.replace(/[^0-9]/g, ""); // Only digits

    if (newPhone) {
      onChange(`${activeCountry.dialCode}${newPhone}`);
    } else {
      onChange("");
    }
  };

  return (
    <div className="space-y-4">
      <CountrySelect
        value={activeCountry.code}
        onChange={handleCountryChange}
        disabled={disabled}
      />
      
      <div className="space-y-2">
        <Label htmlFor="phone">{label}</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-sm text-muted-foreground">
              {activeCountry.dialCode}
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
