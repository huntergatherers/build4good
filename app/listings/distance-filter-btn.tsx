"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function DistanceFilterButton() {
  const params = useSearchParams()
  const router = useRouter()
  const type = params.get("type")
  const filterString = params.get("filters")
  const filtersArray = filterString ? filterString.split(" ") : [];
  const distance = params.get("distance")
  const search = params.get("search")
  const searchArray = search ? search.split(" ") : []
    return (
        <button className={`p-2 rounded-md text-xs font-semibold hover:bg-none ${distance ? "bg-blue-100 text-blue-500" : "bg-gray-200 text-gray-600"}`} onClick={() => {
          if (distance) {
            router.push(`/listings?type=${type}&filters=${filtersArray.join('+')}&search=${searchArray.join('+')}`)
          } else {
            router.push(`/listings?type=${type}&filters=${filtersArray.join('+')}&search=${searchArray.join('+')}&distance=2`)
          }
        }}>
            &lt;2km
        </button>
    );
}
