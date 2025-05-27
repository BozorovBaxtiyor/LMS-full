"use client"

import { useState, useEffect } from "react"
import { Search, MapPin } from "lucide-react"

// import FilialCard from "./FilialCard";
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"

const FilialCard = ({ filials }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [userLocation, setUserLocation] = useState(null)
  const [filialsWithDistance, setFilialsWithDistance] = useState(filials)

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  // Calculate distances when user location changes
  useEffect(() => {
    if (userLocation) {
      const filialsWithDist = filials.map((filial) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          parseFloat(filial.lat.$numberDecimal),
          parseFloat(filial.lng.$numberDecimal),
        )
        return { ...filial, distance }
      })

      // Sort by distance
      filialsWithDist.sort((a, b) => (a.distance || 0) - (b.distance || 0))
      setFilialsWithDistance(filialsWithDist)
    }
  }, [userLocation, filials])

  // Filter filials based on search term
  const filteredFilials = filialsWithDistance.filter(
    (filial) =>
      filial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filial.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Our Locations</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search locations..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={getUserLocation} className="whitespace-nowrap">
            <MapPin className="mr-2 h-4 w-4" />
            Find Nearest
          </button>
        </div>
      </div>

      {filteredFilials.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFilials.map((filial) => (
            <FilialCard key={filial._id} filial={filial} />
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No locations found matching your search.</p>
        </div>
      )}
    </div>
  )
}

export default FilialCard;
