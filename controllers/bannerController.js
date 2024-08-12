const bannerModel = require('../models/bannerModel');

const createBanner = (req, res) => {
    const { is_active, description, timer, link } = req.body;
    const banner = { is_active, description, timer, link };

    bannerModel.createBanner(banner, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create banner' });
        }
        res.status(201).json({ message: 'Banner created successfully', bannerId: result.insertId,banner });
    });
};

const decreaseBannerTimer = (req, res) => {
    const { id } = req.params;

    bannerModel.decreaseBannerTimer(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to decrease banner timer' });
        }

        // Result should include the updated banner data
        if (result.length === 0) {
            return res.status(404).json({ error: 'Banner not found' });
        }

        res.json({ message: 'Banner timer decreased successfully', banner: result[0] });
    });
};


const getBanner = (req, res) => {
    bannerModel.getBanner((err, result) => {
        if (err || result.length === 0) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        res.json(result[0]);
    });
};


const updateBanner = (req, res) => {
    const { id } = req.params;
    const { is_active, description, timer, link } = req.body;
    const banner = { is_active, description, timer, link };

    bannerModel.updateBanner(id, banner, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update banner' });
        }

        // Fetch the updated banner data
        bannerModel.getBannerById(id, (err, updatedResult) => {
            if (err || updatedResult.length === 0) {
                return res.status(404).json({ error: 'Banner not found after update' });
            }
            res.json({ message: 'Banner updated successfully', banner: updatedResult[0] });
        });
    });
};


const deleteBanner = (req, res) => {
    const { id } = req.params;

    bannerModel.deleteBanner(id, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete banner' });
        }
        res.json({ message: 'Banner deleted successfully' });
    });
};

module.exports = {
    createBanner,
    getBanner,
    updateBanner,
    deleteBanner,
    decreaseBannerTimer
};
