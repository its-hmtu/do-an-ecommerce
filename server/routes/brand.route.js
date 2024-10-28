const express = require('express')
const router = express.Router()

// const { createBrand, getBrands, getBrand, updateBrand, deleteBrand } = require('../controllers/brand.controller')

const {
  getBrands 
} = require('../controllers/brand.controller')

router.get('/', getBrands)

// router.get('/:id', getBrand)

// router.post('/', createBrand)

// router.put('/:id', updateBrand)

// router.delete('/:id', deleteBrand)

module.exports = router