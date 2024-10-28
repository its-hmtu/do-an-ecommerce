import { AddCircleRounded, ChevronRightRounded, DownloadRounded, HomeRounded } from '@mui/icons-material'
import { Box, Breadcrumbs, Button, Typography } from '@mui/joy'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import React from 'react'
import CategoryTable from './components/CategoryTable'

function CategoryPage() {
  const navigate = useNavigate()
  return (
    <>
    <Outlet/>
  </>
  )
}

export default CategoryPage