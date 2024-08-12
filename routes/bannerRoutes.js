const express = require('express');
const bannerController = require('../controllers/bannerController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/create',authenticateToken ,bannerController.createBanner);
router.get('/get', bannerController.getBanner);
router.put('/update/:id', bannerController.updateBanner);
router.delete('/delete/:id',authenticateToken ,bannerController.deleteBanner);

router.put('/decrease-time/:id',  bannerController.decreaseBannerTimer);

module.exports = router;
