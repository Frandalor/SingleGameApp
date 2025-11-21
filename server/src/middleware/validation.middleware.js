import mongoose from 'mongoose';

export const validate = (schema) => (req, res, next) => {
  const validationContext = {
    body: req.body,
    query: req.query,
    params: req.params,
  };

  const filteredData = schema.safeParse(validationContext);

  if (!filteredData.success) {
    const errors = filteredData.error.issues.map((i) => i.message);
    return res.status(400).json({ message: errors });
  }

  req.validatedData = filteredData.data;

  next();
};
