"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedCountry.flag}</span>
            <span>{selectedCountry.dialCode}</span>
            <ChevronDown className="ml-auto h-4 w-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
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
        <ScrollArea className="h-60">
          <div className="p-1">
            {filteredCountries.length === 0 ? (
              <div className="p-3 text-center text-muted-foreground text-sm">
                کشوری یافت نشد
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors text-sm",
                    country.code === selectedCountry.code && "bg-muted"
                  )}
                  onClick={() => {
                    onChange(country);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1 text-right">
                    <div className="font-medium">{country.nameFa}</div>
                    <div className="text-xs text-muted-foreground">
                      {country.name} • {country.dialCode}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
