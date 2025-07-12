import User from '../model/user.model.js';

const createUser = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;
    if ( !email || !password) {
      return res.status(400).json({ error: 'email and password are required.' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email.' });
    }
    const user = new User({ name, email, password, age });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'something went wrong' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search
      ? { $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ] }
      : {};

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(query);
    res.json({
      users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'something went wrong' });
  }
};
export { getUsers, createUser };
