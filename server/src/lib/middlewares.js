export const validate = (schema) => (req, res, next) => {
  const filteredData = schema.safeParse(req.body);

  if (!filteredData.success) {
    const errors = filteredData.error.issues.map((i) => i.message);
    return res.status(400).json({ message: errors });
  }

  req.validatedData = filteredData.data;

  next();
};
