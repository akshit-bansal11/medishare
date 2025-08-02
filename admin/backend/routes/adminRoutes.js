const express = require('express');
const router = express.Router();
const auth = require('../middleware/adminAuth');
const {
  getUsers, blockUser, deleteUser, deleteProfile,
  getMedicines, deleteMedicine,
  getCollections, clearCollection, deleteCollection
} = require('../controllers/adminController');

router.use(auth);

router.get('/users', getUsers);
router.post('/block-user/:id', blockUser);
router.delete('/user/:id', deleteUser);
router.delete('/profile/:userId', deleteProfile);

router.get('/medicines', getMedicines);
router.delete('/medicine/:id', deleteMedicine);

router.get('/collections', getCollections);
router.delete('/collections/:name', deleteCollection);
router.delete('/collections/:name/clear', clearCollection);

module.exports = router;
