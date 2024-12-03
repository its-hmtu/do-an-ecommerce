import React from 'react'
import { useLocation } from 'react-router-dom'

function SearchResultPage() {
  const {state} = useLocation()
  return (
    <div>
      {state.value}
    </div>
  )
}

export default SearchResultPage