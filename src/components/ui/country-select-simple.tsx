"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, Search } from "lucide-react";
import { countries, Country, getDefaultCountry } from "@/lib/countries";
import { cn } from "@/lib/utils";

interface CountrySelectProps {
  value: string;
  onChange: (country: Country) => void;
  disabled?: boolean;
}

export function CountrySelect({ value, onChange, disabled }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  const selectedCountry = countries.find(c => c.code === value) || getDefaultCountry();

  const filteredCountries = countries.filter(country =>
    country.nameFa.toLowerCase().includes(search.toLowerCase()) ||
    country.name.toLowerCase().includes(search.toLowerCase()) ||
    country.dialCode.includes(search)
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">کشور</Label>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground"
        )}
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedCountry.flag}</span>
          <span>{selectedCountry.dialCode}</span>
          <span className="text-sm text-muted-foreground">{selectedCountry.nameFa}</span>
          <ChevronDown className="ml-auto h-4 w-4" />
        </div>
      </Button>
      
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg max-h-80">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجوی کشور..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-60">
            {filteredCountries.length === 0 ? (
              <div className="p-3 text-center text-muted-foreground text-sm">
                کشوری یافت نشد
              </div>
            ) : (
              filteredCountries.slice(0, 25).map((country) => (
                <button
                  key={country.code}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-sm text-right border-b last:border-b-0",
                    country.code === selectedCountry.code && "bg-muted"
                  )}
                  onClick={() => {
                    onChange(country);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{country.nameFa}</div>
                    <div className="text-xs text-muted-foreground">
                      {country.name} • {country.dialCode}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Click outside to close */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
