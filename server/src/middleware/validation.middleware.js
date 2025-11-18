import mongoose from 'mongoose';

export const validate = (schema) => (req, res, next) => {
  const filteredData = schema.safeParse(req.body);

  if (!filteredData.success) {
    const errors = filteredData.error.issues.map((i) => i.message);
    return res.status(400).json({ message: errors });
  }

  req.validatedData = filteredData.data;

  next();
};

export const validateObjectId =
  (...paramNames) =>
  (req, res, next) => {
    for (const paramName of paramNames) {
      const id = req.params[paramName];
      // controllo se id valido per mongoose

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        console.warn(
          `Tentativo di accesso con ID non valido: ${paramName}=${id}`
        );
        res.status(400).json({
          message: `ID non valido. Il parametro '${paramName}' deve essere un ID MongoDB valido.`,
        });
      }
    }
    next();
  };
