const express = require('express');
const router = express.Router();
const dataExportController = require('../controllers/dataExportController');

// Export all data as CSV
router.get('/csv', dataExportController.exportCSV);

// Export data in Stata-ready format
router.get('/stata', dataExportController.exportStata);

// Get export statistics
router.get('/stats', dataExportController.getExportStats);

// Admin: Export raw table data
router.get('/raw/:tableName', dataExportController.exportRawTable);

module.exports = router;