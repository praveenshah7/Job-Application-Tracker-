const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');

// Get all jobs for user
router.get('/', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add job
router.post('/', auth, async (req, res) => {
  try {
    const job = new Job({ ...req.body, user: req.user.id });
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job
router.delete('/:id', auth, async (req, res) => {
  try {
    await Job.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get stats
router.get('/stats', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id });
    const stats = {
      total: jobs.length,
      applied: jobs.filter(j => j.status === 'Applied').length,
      screening: jobs.filter(j => j.status === 'Screening').length,
      interview: jobs.filter(j => j.status === 'Interview').length,
      offer: jobs.filter(j => j.status === 'Offer').length,
      rejected: jobs.filter(j => j.status === 'Rejected').length,
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
