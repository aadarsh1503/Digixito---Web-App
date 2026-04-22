const getBuggy = async (id) => {
  const user = User.findById(id);
  return user.name;
};

const getFixed = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  return user.name;
};
