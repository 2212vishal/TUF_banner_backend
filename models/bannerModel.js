const db = require('../config/db');

const createBanner = (banner, callback) => {
    // First, delete all existing banners
    const deleteSql = 'DELETE FROM banners';
    db.query(deleteSql, (err) => {
        if (err) {
            return callback(err);
        }

        // Then, insert the new banner
        const insertSql = 'INSERT INTO banners (is_active, description, timer, link) VALUES (?, ?, ?, ?)';
        db.query(insertSql, [banner.is_active, banner.description, banner.timer, banner.link], callback);
    });
};

const decreaseBannerTimer = (id, callback) => {
    // First, get the current banner data
    const getSql = 'SELECT timer FROM banners WHERE id = ?';
    db.query(getSql, [id], (err, results) => {
        if (err || results.length === 0) {
            return callback(err || new Error('Banner not found'));
        }

        const currentTimer = results[0].timer;
        const [hours, minutes, seconds] = currentTimer.split(':').map(Number);

        // Convert the timer to total seconds, decrease by 1, then convert back to hh:mm:ss
        let totalSeconds = hours * 3600 + minutes * 60 + seconds - 1;
        if (totalSeconds < 0) totalSeconds = 0; // Ensure timer doesn't go negative

        const newHours = Math.floor(totalSeconds / 3600);
        const newMinutes = Math.floor((totalSeconds % 3600) / 60);
        const newSeconds = totalSeconds % 60;

        const newTimer = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;

        // Update the banner with the new timer
        const updateSql = 'UPDATE banners SET timer = ? WHERE id = ?';
        db.query(updateSql, [newTimer, id], (err) => {
            if (err) {
                return callback(err);
            }

            // Fetch the updated banner data
            const getUpdatedSql = 'SELECT * FROM banners WHERE id = ?';
            db.query(getUpdatedSql, [id], callback);
        });
    });
};


const getBanner = (callback) => {
    const sql = 'SELECT * FROM banners ORDER BY id DESC LIMIT 1';
    db.query(sql, callback);
};

const getBannerById = (id, callback) => {
    const sql = 'SELECT * FROM banners WHERE id = ?';
    db.query(sql, [id], callback);
};

const updateBanner = (id, banner, callback) => {
    const sql = 'UPDATE banners SET is_active = ?, description = ?, timer = ?, link = ? WHERE id = ?';
    db.query(sql, [banner.is_active, banner.description, banner.timer, banner.link, id], callback);
};

const deleteBanner = (id, callback) => {
    const sql = 'DELETE FROM banners WHERE id = ?';
    db.query(sql, [id], callback);
};

module.exports = {
    createBanner,
    getBanner,
    getBannerById,
    updateBanner,
    deleteBanner,
    decreaseBannerTimer
};
